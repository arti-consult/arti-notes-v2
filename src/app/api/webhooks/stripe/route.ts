// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import {
  getStripeSecretKey,
  getStripeWebhookSecret,
} from "@/lib/config/stripe";

// Initialize Stripe with the secret key (not webhook secret)
const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: "2025-04-30.basil",
  typescript: true,
});

// This is crucial - it tells Next.js not to parse the body
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Get the raw body as an ArrayBuffer, then convert to Buffer
    const arrayBuffer = await req.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    console.log("Received webhook with signature:", signature);

    // Get webhook secret using your config function
    const webhookSecret = getStripeWebhookSecret();

    if (!webhookSecret) {
      console.error("Stripe webhook secret is not configured");
      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    // Add debug logging
    console.log("Webhook secret length:", webhookSecret.length);
    console.log("Webhook secret first 4 chars:", webhookSecret.substring(0, 4));

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Construct and verify the webhook event
    let event: Stripe.Event;
    try {
      // Use the raw body Buffer for signature verification
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
          // Retrieve customer to get user metadata
          const customer = (await stripe.customers.retrieve(
            session.customer as string
          )) as Stripe.Customer;

          const userId = customer.metadata?.userId;

          if (!userId) {
            return NextResponse.json({ received: true });
          }

          console.log(`Checkout completed for user: ${userId}`);
          return NextResponse.json({ received: true });
        } catch (err) {
          return NextResponse.json({ received: true });
        }
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;

        try {
          // Get customer to find associated user
          const customer = (await stripe.customers.retrieve(
            subscription.customer as string
          )) as Stripe.Customer;

          const userId = customer.metadata?.userId;

          if (!userId) {
            console.error("No userId found in customer metadata");
            return NextResponse.json({ received: true });
          }

          return NextResponse.json({ received: true });
        } catch (err) {
          return NextResponse.json({ received: true });
        }
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        try {
          const customer = (await stripe.customers.retrieve(
            subscription.customer as string
          )) as Stripe.Customer;

          const userId = customer.metadata?.userId;

          if (!userId) {
            return NextResponse.json({ received: true });
          }

          return NextResponse.json({ received: true });
        } catch (err) {
          return NextResponse.json({ received: true });
        }
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        try {
          const customer = (await stripe.customers.retrieve(
            subscription.customer as string
          )) as Stripe.Customer;

          const userId = customer.metadata?.userId;

          if (!userId) {
            return NextResponse.json({ received: true });
          }

          return NextResponse.json({ received: true });
        } catch (err) {
          return NextResponse.json({ received: true });
        }
      }

      // Acknowledge other events without special handling
      case "payment_method.attached":
      case "customer.created":
      case "customer.updated":
      case "setup_intent.created":
      case "setup_intent.succeeded":
      case "invoice.created":
      case "invoice.finalized":
      case "invoice.paid":
      case "invoice.payment_succeeded":
      case "payment_link.created": {
        return NextResponse.json({ received: true });
      }

      default: {
        return NextResponse.json({ received: true });
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
