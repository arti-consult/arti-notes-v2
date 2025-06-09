// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const productTag = searchParams.get("p"); // Get product tag from URL

  console.log("Auth callback received:", {
    hasCode: !!code,
    productTag,
  });

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

      // Store product tag in user metadata if present and not already stored
      if (productTag && !user.user_metadata?.product_tag) {
        console.log("Updating user metadata with product tag:", productTag);
        const { error: updateError } = await supabase.auth.updateUser({
          data: { product_tag: productTag },
        });

        if (updateError) {
          console.error("Error updating user metadata:", updateError);
        }
      }

      // Check if user has completed payment and onboarding
      const { data: onboarding, error: onboardingError } = await supabase
        .from("user_onboarding")
        .select("payment_completed, completed_at, product_tag")
        .eq("user_id", user.id)
        .maybeSingle(); // Use maybeSingle to handle no records

      // Only log error if it's not a "no records found" error
      if (onboardingError && onboardingError.code !== "PGRST116") {
        console.error("Error fetching onboarding data:", onboardingError);
      }

      // Create onboarding record if it doesn't exist
      if (!onboarding) {
        console.log("Creating onboarding record for OAuth user");
        const { error: createError } = await supabase
          .from("user_onboarding")
          .insert({
            user_id: user.id,
            payment_completed: false,
            product_tag: productTag || user.user_metadata?.product_tag || null,
            user_type: null,
            team_size: null,
            referral_source: null,
            audio_purpose: null,
            mic_permission: false,
            completed_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (createError) {
          console.error("Error creating onboarding record:", createError);
        }
      }

      const hasCompletedPayment = onboarding?.payment_completed || false;
      const hasCompletedOnboarding = onboarding?.completed_at !== null;
      const finalProductTag =
        productTag ||
        onboarding?.product_tag ||
        user.user_metadata?.product_tag;

      console.log("Auth callback - user state:", {
        userId: user.id,
        hasCompletedPayment,
        hasCompletedOnboarding,
        finalProductTag,
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
        if (finalProductTag) {
          // Use tagged payment link
          const taggedPaymentUrl = `https://buy.stripe.com/${finalProductTag}`;
          console.log("Redirecting to tagged payment link:", taggedPaymentUrl);
          return NextResponse.redirect(taggedPaymentUrl);
        } else {
          // Use default payment link or redirect to payment page
          const defaultPaymentUrl = "/payment";
          console.log("Redirecting to payment page:", defaultPaymentUrl);
          redirectUrl = defaultPaymentUrl;
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
