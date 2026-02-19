import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Log order details
        console.log("=== ORDER COMPLETED ===");
        console.log("Session ID:", session.id);
        console.log("Customer Email:", session.customer_details?.email);
        console.log("Customer Name:", session.customer_details?.name);
        console.log("Amount Total:", session.amount_total ? session.amount_total / 100 : 0, "USD");
        console.log("Payment Status:", session.payment_status);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.log("Shipping:", JSON.stringify((session as any).shipping_details));
        console.log("=======================");

        // TODO: Write order to database when DB is running
        // await prisma.order.create({
        //   data: {
        //     stripeSessionId: session.id,
        //     customerEmail: session.customer_details?.email || '',
        //     customerName: session.customer_details?.name || '',
        //     amountTotal: session.amount_total || 0,
        //     paymentStatus: session.payment_status,
        //     shippingAddress: JSON.stringify(session.shipping_details),
        //   },
        // });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(
          "Payment failed:",
          paymentIntent.id,
          paymentIntent.last_payment_error?.message
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
