import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createSubscriptionCheckout } from "@/utils/stripe/stripe-service";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Verify user exists and is authenticated
    const supabase = await createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user.user || user.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the default price ID from environment or database
    let priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    // Alternatively, get the default plan from database
    if (!priceId) {
      const { data: defaultPlan, error: planError } = await supabase
        .from("pricing_plans")
        .select("stripe_price_id")
        .eq("is_default", true)
        .single();

      if (planError || !defaultPlan) {
        return NextResponse.json(
          { error: "No default pricing plan configured" },
          { status: 500 }
        );
      }

      priceId = defaultPlan.stripe_price_id;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "No pricing plan available" },
        { status: 500 }
      );
    }

    // Create the checkout session
    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;
    const successUrl = `${origin}/onboarding?payment=success`;
    const cancelUrl = `${origin}/onboarding?payment=cancelled`;

    const checkoutUrl = await createSubscriptionCheckout(
      userId,
      priceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}
