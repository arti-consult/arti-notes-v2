// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { createClient } from "@/utils/supabase/server";
import { StripeSubscription } from "@/utils/stripe/server";
import { getStripeSecretKey } from "@/lib/config/stripe";

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
}

const stripe = new Stripe(getStripeSecretKey());

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  try {
    // Handle the event
    switch (event.type) {
      // Subscription events
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Handle subscription creation
        if (session.mode === "subscription" && session.subscription) {
          const subscription = (await stripe.subscriptions.retrieve(
            session.subscription as string
          )) as StripeSubscription;
          const priceId = subscription.items.data[0].price.id;

          // Find the plan in our database that corresponds to this price
          const { data: plan } = await supabase
            .from("pricing_plans")
            .select("id, name, minutes")
            .eq("stripe_price_id", priceId)
            .single();

          if (!plan) {
            throw new Error("No matching plan found for price ID");
          }

          // Get the customer's user ID from metadata
          const customer = (await stripe.customers.retrieve(
            session.customer as string
          )) as Stripe.Customer;
          const userId = customer.metadata?.userId;

          if (!userId) {
            throw new Error("No user ID found in customer metadata");
          }

          // Create the subscription record
          await supabase.from("subscriptions").insert({
            user_id: userId,
            plan_id: plan.id,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            minutes_used: 0,
            minutes_remaining: plan.minutes,
            minutes_reset_at: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
          });

          // Get the role ID for this plan
          const { data: role } = await supabase
            .from("roles")
            .select("id")
            .eq("name", plan.name.toLowerCase())
            .single();

          if (role) {
            // Remove existing non-admin roles
            const { data: currentRoles } = await supabase
              .from("user_roles")
              .select("role_id, roles(name)")
              .eq("user_id", userId);

            const rolesToDelete =
              currentRoles
                ?.filter((r) => (r.roles as any).name !== "admin")
                .map((r) => r.role_id) || [];

            if (rolesToDelete.length > 0) {
              await supabase
                .from("user_roles")
                .delete()
                .eq("user_id", userId)
                .in("role_id", rolesToDelete);
            }

            // Assign the new role
            await supabase.from("user_roles").insert({
              user_id: userId,
              role_id: role.id,
            });
          }
        }

        // Handle one-time payment for credit package
        if (
          session.mode === "payment" &&
          session.payment_intent &&
          session.metadata?.creditPackageId
        ) {
          // Get the credit package details
          const { data: creditPackage } = await supabase
            .from("credit_packages")
            .select("minutes")
            .eq("id", session.metadata.creditPackageId)
            .single();

          if (!creditPackage) {
            throw new Error("No matching credit package found");
          }

          // Get the customer's user ID from metadata
          const customer = (await stripe.customers.retrieve(
            session.customer as string
          )) as Stripe.Customer;
          const userId = customer.metadata?.userId;

          if (!userId) {
            throw new Error("No user ID found in customer metadata");
          }

          // Get the user's current subscription
          const { data: subscription } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (subscription) {
            // Update the subscription with additional minutes
            await supabase
              .from("subscriptions")
              .update({
                minutes_remaining:
                  subscription.minutes_remaining + creditPackage.minutes,
                updated_at: new Date().toISOString(),
              })
              .eq("id", subscription.id);
          } else {
            // Create a new subscription record if none exists
            await supabase.from("subscriptions").insert({
              user_id: userId,
              status: "active",
              minutes_used: 0,
              minutes_remaining: creditPackage.minutes,
              minutes_reset_at: new Date().toISOString(),
            });
          }
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as StripeSubscription;

        // Update the subscription in our database
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as StripeSubscription;

        // Get user ID from metadata
        const userId = subscription.metadata?.userId;

        // Update subscription to canceled
        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        // When subscription is deleted, assign free role
        if (userId) {
          const { data: freeRole } = await supabase
            .from("roles")
            .select("id")
            .eq("name", "free")
            .single();

          if (freeRole) {
            // Remove existing non-admin roles
            const { data: currentRoles } = await supabase
              .from("user_roles")
              .select("role_id, roles(name)")
              .eq("user_id", userId);

            const rolesToDelete =
              currentRoles
                ?.filter((r) => (r.roles as any).name !== "admin")
                .map((r) => r.role_id) || [];

            if (rolesToDelete.length > 0) {
              await supabase
                .from("user_roles")
                .delete()
                .eq("user_id", userId)
                .in("role_id", rolesToDelete);
            }

            // Assign the free role
            await supabase.from("user_roles").insert({
              user_id: userId,
              role_id: freeRole.id,
            });
          }
        }

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & {
          subscription: string;
        };
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = (await stripe.subscriptions.retrieve(
            subscriptionId
          )) as StripeSubscription;

          // If this is a renewal, reset the minutes quota
          const currentPeriodStart = new Date(
            subscription.current_period_start * 1000
          ).toISOString();

          // Get subscription from database
          const { data: subscriptionData } = await supabase
            .from("subscriptions")
            .select("*, pricing_plans(*)")
            .eq("stripe_subscription_id", subscriptionId)
            .single();

          if (subscriptionData) {
            const pricingPlan = subscriptionData.pricing_plans;

            // Reset minutes for the new billing period
            await supabase
              .from("subscriptions")
              .update({
                minutes_used: 0,
                minutes_remaining: pricingPlan.minutes,
                minutes_reset_at: currentPeriodStart,
                status: subscription.status,
                current_period_start: new Date(
                  subscription.current_period_start * 1000
                ).toISOString(),
                current_period_end: new Date(
                  subscription.current_period_end * 1000
                ).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", subscriptionData.id);
          }
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & {
          subscription: string;
        };
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          // Update subscription status to reflect payment failure
          await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
