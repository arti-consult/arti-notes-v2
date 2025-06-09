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
        .select("payment_completed, completed_at")
        .eq("user_id", user.id)
        .maybeSingle(); // Use maybeSingle to handle no records

      // Only log error if it's not a "no records found" error
      if (onboardingError && onboardingError.code !== "PGRST116") {
        console.error("Error fetching onboarding data:", onboardingError);
      }

      const hasCompletedPayment = onboarding?.payment_completed || false;
      const hasCompletedOnboarding = onboarding?.completed_at !== null;

      console.log("Auth callback - user state:", {
        userId: user.id,
        hasCompletedPayment,
        hasCompletedOnboarding,
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
        // No payment completed yet (includes new users)
        redirectUrl = "/payment";
      }

      // Build redirect URL
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
