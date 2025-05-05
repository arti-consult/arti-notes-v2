import { Stripe } from "stripe";
import { createClient } from "@/utils/supabase/server";
import { getStripeSecretKey } from "@/lib/config/stripe";

const stripe = new Stripe(getStripeSecretKey());

/**
 * Get or create a Stripe customer for a user
 */
async function getOrCreateStripeCustomer(userId: string): Promise<string> {
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
export async function createSubscriptionCheckout(
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
    subscription_data: {
      trial_period_days: 14,
    },
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      userId,
      type: "subscription",
    },
  });

  return session.url || "";
}

/**
 * Create a Stripe Checkout session for credit package
 */
export async function createCreditPackageCheckout(
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
    mode: "payment",
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    metadata: {
      userId,
      type: "credits",
    },
  });

  return session.url || "";
}
