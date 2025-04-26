// src/utils/stripe/server.ts
import { Stripe } from "stripe";
import { createClient } from "@/utils/supabase/server";
import { PricingTier, UserSubscription } from "@/types/subscription";

export type StripeSubscription = Stripe.Response<Stripe.Subscription> & {
  current_period_start: number;
  current_period_end: number;
};

interface StripeSubscriptionWithTimestamps {
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  id: string;
  items?: {
    data: Array<{
      price: {
        id: string;
      };
    }>;
  };
}

export const getSubscriptionWithTimestamps = (
  subscription: Stripe.Response<Stripe.Subscription> | Stripe.Subscription
): StripeSubscriptionWithTimestamps => {
  return subscription as unknown as StripeSubscriptionWithTimestamps;
};

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string
): Promise<string> {
  const supabase = await createClient();

  // First, check if user already has a Stripe customer ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // If not, fetch user info and create a new Stripe customer
  const { data: user } = await supabase.auth.admin.getUserById(userId);

  if (!user || !user.user) {
    throw new Error("User not found");
  }

  const customer = await stripe.customers.create({
    email: user.user.email,
    name: user.user.user_metadata?.full_name || user.user.email,
    metadata: {
      supabaseUserId: userId,
    },
  });

  // Store the Stripe customer ID in the user's profile
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  return customer.id;
}

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  returnUrl: string
): Promise<string> {
  const customerId = await getOrCreateStripeCustomer(userId);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session.url || "";
}

/**
 * Create a Stripe Portal session for managing subscription
 */
export async function createPortalSession(
  userId: string,
  returnUrl: string
): Promise<string> {
  const customerId = await getOrCreateStripeCustomer(userId);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Fetch all available pricing plans from the database
 */
export async function getPricingPlans(): Promise<PricingTier[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pricing_plans")
    .select("*")
    .order("price");

  if (error) {
    throw error;
  }

  // Parse JSON features
  return data.map((plan) => ({
    ...plan,
    features:
      typeof plan.features === "string"
        ? JSON.parse(plan.features)
        : plan.features,
  }));
}

/**
 * Get a user's active subscription
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      plan:pricing_plans(*)
    `
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    plan: data.plan as PricingTier,
  };
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}
