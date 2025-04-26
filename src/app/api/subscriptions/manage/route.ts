// src/app/api/subscriptions/manage/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
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

    // Get redirect URL from query params or use dashboard as default
    const redirectUrl =
      req.nextUrl.searchParams.get("redirect_url") || "/dashboard";

    // Get the user's subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (subscriptionError || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // Redirect to the Stripe customer portal
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error managing subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
