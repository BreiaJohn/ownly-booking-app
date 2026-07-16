import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from "npm:stripe@^22"

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")
const supabaseUrl = Deno.env.get("SUPABASE_URL")
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

if (
  !stripeSecretKey ||
  !webhookSecret ||
  !supabaseUrl ||
  !serviceRoleKey
) {
  throw new Error("Required environment variables are missing.")
}

const stripe = new Stripe(stripeSecretKey)
const cryptoProvider = Stripe.createSubtleCryptoProvider()

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
  console.log("Webhook body received")

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
    const session =
      event.data.object as Stripe.Checkout.Session

    const bookingId =
      session.metadata?.booking_id ||
      session.client_reference_id

    console.log("Booking ID:", bookingId)
    console.log("Payment status:", session.payment_status)

    if (!bookingId) {
      throw new Error("Booking ID was not included in the Checkout Session.")
    }

    if (session.payment_status !== "paid") {
      return Response.json({
        received: true,
        updated: false,
        paymentStatus: session.payment_status,
      })
    }

    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/bookings?id=eq.${encodeURIComponent(
        bookingId
      )}`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          status: "Confirmed",
          payment_status: "Paid",
        }),
      }
    )

    const responseText = await updateResponse.text()

    console.log("Database response status:", updateResponse.status)
    console.log("Database response:", responseText)

    if (!updateResponse.ok) {
      throw new Error(
        `Booking update failed: ${updateResponse.status} ${responseText}`
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