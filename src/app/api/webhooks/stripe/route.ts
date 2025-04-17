// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { createClient } from "@/utils/supabase/server";
import { StripeSubscription } from "@/utils/stripe/server";
import { getSubscriptionWithTimestamps } from "@/utils/stripe/server";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      if (userId && subscriptionId) {
        // Fetch the subscription to get the price ID
        const rawSubscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const subscription = getSubscriptionWithTimestamps(rawSubscription);
        const priceId = subscription.items?.data[0].price.id;

        // Find the plan in our database that corresponds to this price
        const { data: plan } = await supabase
          .from("pricing_plans")
          .select("id")
          .eq("stripe_price_id", priceId)
          .single();

        if (plan) {
          // Create the subscription record
          await supabase.from("subscriptions").insert({
            user_id: userId,
            plan_id: plan.id,
            stripe_subscription_id: subscriptionId,
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });

          // Get the plan name to assign the correct role
          const { data: planData } = await supabase
            .from("pricing_plans")
            .select("name")
            .eq("id", plan.id)
            .single();

          if (planData) {
            // Determine which role to assign based on the plan name
            const roleName = planData.name.toLowerCase();

            // Get the role ID
            const { data: role } = await supabase
              .from("roles")
              .select("id")
              .eq("name", roleName)
              .single();

            if (role) {
              // Remove existing roles first (except admin)
              const { data: currentRoles } = await supabase
                .from("user_roles")
                .select("role_id, roles(name)")
                .eq("user_id", userId);

              // Filter out admin roles
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
        }
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        const rawSubscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const subscription = getSubscriptionWithTimestamps(rawSubscription);
        const subscriptionData = {
          status: subscription.status,
          current_period_start: new Date(
            subscription.current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        };
        await supabase
          .from("subscriptions")
          .update({
            status: subscriptionData.status,
            current_period_start: subscriptionData.current_period_start,
            current_period_end: subscriptionData.current_period_end,
            cancel_at_period_end: subscriptionData.cancel_at_period_end,
          })
          .eq("stripe_subscription_id", subscriptionId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const rawSubscription = event.data.object as Stripe.Subscription;
      const subscription = getSubscriptionWithTimestamps(rawSubscription);

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
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const rawSubscription = event.data.object as Stripe.Subscription;
      const subscription = getSubscriptionWithTimestamps(rawSubscription);

      // Find the subscription record
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (subData) {
        // Update the subscription to canceled
        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
          })
          .eq("stripe_subscription_id", subscription.id);

        // Assign free role to user
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
            .eq("user_id", subData.user_id);

          // Filter out admin roles
          const rolesToDelete =
            currentRoles
              ?.filter((r) => (r.roles as any).name !== "admin")
              .map((r) => r.role_id) || [];

          if (rolesToDelete.length > 0) {
            await supabase
              .from("user_roles")
              .delete()
              .eq("user_id", subData.user_id)
              .in("role_id", rolesToDelete);
          }

          // Assign the free role
          await supabase.from("user_roles").insert({
            user_id: subData.user_id,
            role_id: freeRole.id,
          });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
