// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  createSubscriptionCheckout,
  createCreditPackageCheckout,
} from "@/utils/stripe/stripe-service";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    const { type, priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    let checkoutUrl: string;
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;

    // Handle different checkout types
    if (type === "subscription") {
      // Create subscription checkout
      checkoutUrl = await createSubscriptionCheckout(
        user.id,
        priceId,
        returnUrl
      );
    } else if (type === "credits") {
      // Create credit package checkout
      checkoutUrl = await createCreditPackageCheckout(
        user.id,
        priceId,
        returnUrl
      );
    } else {
      return NextResponse.json(
        { error: "Invalid checkout type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
