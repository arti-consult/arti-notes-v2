// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/payment";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      // Get user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Failed to get user after auth:", userError);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      // Check if user has completed payment and onboarding
      const { data: onboarding, error: onboardingError } = await supabase
        .from("user_onboarding")
        .select("payment_completed, completed_at, payment_link_tag")
        .eq("user_id", user.id)
        .maybeSingle(); // Use maybeSingle to handle no records

      // Only log error if it's not a "no records found" error
      if (onboardingError && onboardingError.code !== "PGRST116") {
        console.error("Error fetching onboarding data:", onboardingError);
      }

      const hasCompletedPayment = onboarding?.payment_completed || false;
      const hasCompletedOnboarding = onboarding?.completed_at !== null;
      const paymentLinkTag =
        onboarding?.payment_link_tag || user.user_metadata?.payment_link_tag;

      console.log("Auth callback - user state:", {
        userId: user.id,
        hasCompletedPayment,
        hasCompletedOnboarding,
        paymentLinkTag,
        onboardingData: onboarding,
      });

      let redirectUrl: string;

      if (hasCompletedPayment && hasCompletedOnboarding) {
        // Both payment and onboarding completed, go to dashboard
        redirectUrl = "/dashboard";
      } else if (hasCompletedPayment && !hasCompletedOnboarding) {
        // Payment completed but not onboarding
        redirectUrl = "/onboarding";
      } else {
        // No payment completed yet - redirect to appropriate Stripe payment link
        if (paymentLinkTag) {
          // Use tagged payment link
          const taggedPaymentUrl = `https://buy.stripe.com/${paymentLinkTag}`;
          console.log("Redirecting to tagged payment link:", taggedPaymentUrl);
          return NextResponse.redirect(taggedPaymentUrl);
        } else {
          // Use default payment link
          const defaultPaymentUrl =
            "https://buy.stripe.com/test_8x228r7TA4qU57l4d1ak002";
          console.log(
            "Redirecting to default payment link:",
            defaultPaymentUrl
          );
          return NextResponse.redirect(defaultPaymentUrl);
        }
      }

      // Build redirect URL for internal routes
      const baseUrl = isLocalEnv
        ? origin
        : forwardedHost
        ? `https://${forwardedHost}`
        : origin;

      console.log("Auth callback redirecting to:", `${baseUrl}${redirectUrl}`);
      return NextResponse.redirect(`${baseUrl}${redirectUrl}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
