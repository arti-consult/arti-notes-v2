// src/app/api/stripe/success/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🎉 Stripe success callback received");

    const supabase = await createClient();
    const url = new URL(request.url);

    // Get session info from Stripe
    const sessionId = url.searchParams.get("session_id");
    console.log("Stripe session ID:", sessionId);

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ User not authenticated:", userError);
      return NextResponse.redirect(
        new URL("/login?error=Authentication required", request.url)
      );
    }

    console.log("💳 Updating payment status for user:", user.id);

    // Update the user's onboarding record to mark payment as completed
    const { error: updateError } = await supabase
      .from("user_onboarding")
      .update({
        payment_completed: true,
        updated_at: new Date().toISOString(),
        // Optionally store Stripe session ID for reference
        ...(sessionId && { stripe_session_id: sessionId }),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("🚨 Error updating payment status:", updateError);
      return NextResponse.redirect(
        new URL("/error?message=Failed to update payment status", request.url)
      );
    }

    console.log("✅ Payment status updated successfully");

    // Redirect to onboarding
    return NextResponse.redirect(new URL("/onboarding", request.url));
  } catch (error) {
    console.error("🚨 Error in Stripe success handler:", error);
    return NextResponse.redirect(
      new URL("/error?message=Payment processing error", request.url)
    );
  }
}
