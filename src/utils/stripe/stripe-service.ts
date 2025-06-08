import { Stripe } from "stripe";
import { createClient } from "@/utils/supabase/server";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Create a subscription checkout session
 */
export async function createSubscriptionCheckout(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl?: string
): Promise<string> {
  try {
    const supabase = await createClient();

    // Get or create customer
    const customer = await getOrCreateCustomer(userId);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          userId: userId,
        },
      },
      metadata: {
        userId: userId,
        type: "subscription",
      },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || successUrl,
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session URL");
    }

    return session.url;
  } catch (error) {
    console.error("Error creating subscription checkout:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to create checkout session"
    );
  }
}

/**
 * Create a credit package checkout session
 */
export async function createCreditPackageCheckout(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl?: string
): Promise<string> {
  try {
    const supabase = await createClient();

    // Get credit package details
    const { data: creditPackage, error } = await supabase
      .from("credit_packages")
      .select("*")
      .eq("stripe_price_id", priceId)
      .single();

    if (error || !creditPackage) {
      throw new Error("Credit package not found");
    }

    // Get or create customer
    const customer = await getOrCreateCustomer(userId);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        type: "credits",
        creditPackageId: creditPackage.id,
      },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || successUrl,
      billing_address_collection: "required",
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session URL");
    }

    return session.url;
  } catch (error) {
    console.error("Error creating credit package checkout:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to create checkout session"
    );
  }
}

/**
 * Create a billing portal session
 */
export async function createPortalSession(
  userId: string,
  returnUrl: string
): Promise<string> {
  try {
    // Get customer
    const customer = await getOrCreateCustomer(userId);

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create portal session"
    );
  }
}

/**
 * Get or create a Stripe customer for a user
 */
async function getOrCreateCustomer(userId: string): Promise<Stripe.Customer> {
  const supabase = await createClient();

  try {
    // Get user details
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw new Error("User profile not found");
    }

    // Check if user already has a Stripe customer ID
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (subscription?.stripe_customer_id) {
      // Return existing customer
      return (await stripe.customers.retrieve(
        subscription.stripe_customer_id
      )) as Stripe.Customer;
    }

    // Get user email from auth
    const { data: user, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError || !user.user) {
      throw new Error("User not found");
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email: user.user.email,
      name: profile.full_name || profile.username || user.user.email,
      metadata: {
        userId: userId,
      },
    });

    return customer;
  } catch (error) {
    console.error("Error getting or creating customer:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get or create customer"
    );
  }
}

/**
 * Get subscription details by user ID
 */
export async function getSubscriptionByUserId(userId: string) {
  const supabase = await createClient();

  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        pricing_plans (
          id,
          name,
          minutes,
          price,
          stripe_price_id
        )
      `
      )
      .eq("user_id", userId)
      .single();

    if (error) {
      return null;
    }

    return subscription;
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<void> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to cancel subscription"
    );
  }
}

/**
 * Reactivate subscription
 */
export async function reactivateSubscription(
  subscriptionId: string
): Promise<void> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to reactivate subscription"
    );
  }
}
