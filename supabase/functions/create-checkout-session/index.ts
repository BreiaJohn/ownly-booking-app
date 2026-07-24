import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from "npm:stripe"

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

const stripe = new Stripe(stripeSecretKey)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    })
  }

  try {
    const {
      bookingId,
      serviceName,
      amount,
      businessName,
      customerEmail,
    } = await req.json()

    if (!bookingId) {
      throw new Error("Booking ID is required")
    }

    if (!serviceName) {
      throw new Error("Service name is required")
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error("A valid amount is required")
    }

    const session = await stripe.checkout.sessions.create({
  mode: "payment",

  client_reference_id: bookingId,

  customer_email: customerEmail || undefined,

  metadata: {
    booking_id: bookingId,
  },

  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: serviceName,
          description: businessName
            ? `Appointment with ${businessName}`
            : "Appointment booking",
        },
        unit_amount: Math.round(Number(amount)),
      },
      quantity: 1,
    },
  ],

  success_url:
    "https://yorly-booking-app.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",

  cancel_url:
    "https://yorly-booking-app.vercel.app/book/geekinwziahhhh",
})

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error: unknown) {
    console.error("Checkout session error:", error)

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})