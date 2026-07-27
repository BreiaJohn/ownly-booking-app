import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from "npm:stripe@^22"

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")
const supabaseUrl = Deno.env.get("SUPABASE_URL")
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const resendApiKey = Deno.env.get("RESEND_API_KEY")

if (
  !stripeSecretKey ||
  !webhookSecret ||
  !supabaseUrl ||
  !serviceRoleKey ||
  !resendApiKey
) {
  throw new Error("Required environment variables are missing.")
}

const stripe = new Stripe(stripeSecretKey)
const cryptoProvider = Stripe.createSubtleCryptoProvider()

const supabaseHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
}

type Booking = {
  id: string
  user_id: string
  client_name: string
  service: string
  date: string
  time: string
  email: string
  phone: string | null
  notes: string | null
  amount: number
  status: string
  payment_status: string
  confirmation_email_sent_at: string | null
}

type BusinessProfile = {
  business_name: string
}

Deno.serve(async (req) => {
  console.log("Webhook request received")

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    console.error("Missing Stripe signature")
    return new Response("Missing Stripe signature", { status: 400 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event

  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    )

    console.log("Stripe event verified:", event.type)
  } catch (error) {
    console.error("Signature verification failed:", error)

    return new Response(
      error instanceof Error
        ? error.message
        : "Invalid Stripe signature",
      { status: 400 }
    )
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({
      received: true,
      ignored: true,
    })
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session

    const bookingId =
      session.metadata?.booking_id ||
      session.client_reference_id

    console.log("Booking ID:", bookingId)
    console.log("Payment status:", session.payment_status)

    if (!bookingId) {
      throw new Error(
        "Booking ID was not included in the Checkout Session."
      )
    }

    if (session.payment_status !== "paid") {
      return Response.json({
        received: true,
        updated: false,
        paymentStatus: session.payment_status,
      })
    }

    const booking = await confirmAndLoadBooking(bookingId)

    if (!booking) {
      throw new Error(
        `Booking ${bookingId} could not be found after payment.`
      )
    }

    const business = await loadBusinessProfile(booking.user_id)
    const businessName = business?.business_name || "the business"

    if (!booking.confirmation_email_sent_at) {
      try {
        await sendConfirmationEmail({
          booking,
          businessName,
        })

        await markConfirmationEmailSent(booking.id)

        console.log("Confirmation email sent:", booking.email)
      } catch (emailError) {
        // Keep the payment confirmed even if email delivery fails.
        console.error("Confirmation email failed:", emailError)
      }
    } else {
      console.log(
        "Confirmation email already sent; skipping duplicate."
      )
    }

    return Response.json({
      received: true,
      updated: true,
      bookingId,
    })
  } catch (error) {
    console.error("Webhook processing error:", error)

    return Response.json(
      {
        received: true,
        updated: false,
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      },
      { status: 500 }
    )
  }
})

async function confirmAndLoadBooking(
  bookingId: string
): Promise<Booking | null> {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/bookings?id=eq.${encodeURIComponent(
      bookingId
    )}&select=id,user_id,client_name,service,date,time,email,phone,notes,amount,status,payment_status,confirmation_email_sent_at`,
    {
      method: "PATCH",
      headers: {
        ...supabaseHeaders,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "Confirmed",
        payment_status: "Paid",
      }),
    }
  )

  const responseText = await response.text()

  console.log("Booking update status:", response.status)
  console.log("Booking update response:", responseText)

  if (!response.ok) {
    throw new Error(
      `Booking update failed: ${response.status} ${responseText}`
    )
  }

  const bookings = JSON.parse(responseText) as Booking[]
  return bookings[0] || null
}

async function loadBusinessProfile(
  userId: string
): Promise<BusinessProfile | null> {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/business_profiles?user_id=eq.${encodeURIComponent(
      userId
    )}&select=business_name&limit=1`,
    {
      headers: supabaseHeaders,
    }
  )

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(
      `Business profile lookup failed: ${response.status} ${responseText}`
    )
  }

  const profiles = JSON.parse(responseText) as BusinessProfile[]
  return profiles[0] || null
}

async function sendConfirmationEmail({
  booking,
  businessName,
}: {
  booking: Booking
  businessName: string
}) {
  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Yorly Bookings <bookings@yorly.co>",
        to: [booking.email],
        subject: `Appointment confirmed with ${businessName}`,
        html: buildConfirmationEmail({
          booking,
          businessName,
        }),
      }),
    }
  )

  const responseText = await response.text()

  console.log("Resend response status:", response.status)
  console.log("Resend response:", responseText)

  if (!response.ok) {
    throw new Error(
      `Resend failed: ${response.status} ${responseText}`
    )
  }
}

async function markConfirmationEmailSent(
  bookingId: string
) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/bookings?id=eq.${encodeURIComponent(
      bookingId
    )}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify({
        confirmation_email_sent_at: new Date().toISOString(),
      }),
    }
  )

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(
      `Could not mark confirmation email as sent: ${response.status} ${responseText}`
    )
  }
}

function buildConfirmationEmail({
  booking,
  businessName,
}: {
  booking: Booking
  businessName: string
}) {
  const safeClientName = escapeHtml(
    booking.client_name || "there"
  )
  const safeBusinessName = escapeHtml(businessName)
  const safeService = escapeHtml(booking.service)
  const formattedDate = escapeHtml(
    formatBookingDate(booking.date)
  )
  const formattedTime = escapeHtml(
    formatBookingTime(booking.time)
  )
  const formattedAmount = formatCurrency(booking.amount)

  return `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <div style="padding:32px 16px;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden;">
            <div style="padding:32px;background:#0f172a;color:#ffffff;">
              <div style="font-size:14px;font-weight:700;color:#60a5fa;text-transform:uppercase;letter-spacing:.08em;">
                Payment received
              </div>

              <h1 style="margin:12px 0 0;font-size:28px;line-height:1.25;">
                Your appointment is confirmed
              </h1>
            </div>

            <div style="padding:32px;">
              <p style="margin:0 0 24px;font-size:16px;line-height:1.7;">
                Hi ${safeClientName}, your payment was received and your appointment with
                <strong>${safeBusinessName}</strong> is confirmed.
              </p>

              <div style="padding:22px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;">
                ${detailRow("Service", safeService)}
                ${detailRow("Date", formattedDate)}
                ${detailRow("Time", formattedTime)}
                ${detailRow("Amount paid", formattedAmount, true)}
              </div>

              <p style="margin:24px 0 0;color:#64748b;font-size:14px;line-height:1.7;">
                Please contact the business directly if you need to make changes to your appointment.
              </p>
            </div>

            <div style="padding:20px 32px;border-top:1px solid #e5e7eb;color:#94a3b8;font-size:12px;text-align:center;">
              Booking powered by Yorly
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

function detailRow(
  label: string,
  value: string,
  isLast = false
) {
  return `
    <div style="display:flex;justify-content:space-between;gap:20px;padding:12px 0;${isLast ? "" : "border-bottom:1px solid #e5e7eb;"}">
      <span style="color:#64748b;">${label}</span>
      <strong style="text-align:right;">${value}</strong>
    </div>
  `
}

function formatBookingDate(dateString: string) {
  return new Date(
    `${dateString}T00:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatBookingTime(timeString: string) {
  const [hours, minutes] = timeString
    .slice(0, 5)
    .split(":")
    .map(Number)

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount || 0))
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}