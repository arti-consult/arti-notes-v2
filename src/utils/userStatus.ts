// src/utils/userStatus.ts
import { SupabaseClient } from "@supabase/supabase-js";

export interface UserStatus {
  hasCompletedPayment: boolean;
  hasCompletedOnboarding: boolean;
  hasOnboardingAnswers: boolean;
  paymentLinkTag?: string | null;
  onboarding?: any;
}

export async function checkUserStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<UserStatus | null> {
  try {
    const { data: onboarding, error: onboardingError } = await supabase
      .from("user_onboarding")
      .select(
        "payment_completed, completed_at, user_type, referral_source, payment_link_tag"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (onboardingError && onboardingError.code !== "PGRST116") {
      console.error("Error fetching onboarding data:", onboardingError);
      return null;
    }

    const hasCompletedPayment = onboarding?.payment_completed || false;
    const hasCompletedOnboarding = onboarding?.completed_at !== null;
    // Simplified check - only need user_type and referral_source
    const hasOnboardingAnswers = !!(
      onboarding?.user_type && onboarding?.referral_source
    );

    // Debug logging
    console.log("👤 User status check:", {
      userId,
      hasCompletedPayment,
      hasCompletedOnboarding,
      hasOnboardingAnswers,
      userType: onboarding?.user_type,
      referralSource: onboarding?.referral_source,
      completedAt: onboarding?.completed_at,
    });

    return {
      hasCompletedPayment,
      hasCompletedOnboarding,
      hasOnboardingAnswers,
      paymentLinkTag: onboarding?.payment_link_tag,
      onboarding,
    };
  } catch (error) {
    console.error("Exception checking user status:", error);
    return null;
  }
}

export function getRedirectPath(userStatus: UserStatus): string | null {
  const { hasCompletedPayment, hasCompletedOnboarding, hasOnboardingAnswers } =
    userStatus;

  if (hasCompletedPayment && hasCompletedOnboarding && hasOnboardingAnswers) {
    return "/dashboard";
  } else if (
    hasCompletedPayment &&
    (!hasOnboardingAnswers || !hasCompletedOnboarding)
  ) {
    return "/onboarding";
  } else if (!hasCompletedPayment) {
    // Return null for payment redirect - handle Stripe URL separately
    return "payment";
  }

  return null;
}

export function getPaymentUrl(
  paymentLinkTag?: string | null,
  defaultTag?: string
): string {
  if (paymentLinkTag) {
    return `https://buy.stripe.com/${paymentLinkTag}`;
  }

  if (defaultTag) {
    return `https://buy.stripe.com/${defaultTag}`;
  }

  // Fallback to your default test link
  return "https://buy.stripe.com/test_fZufZhb5M5uY57l9xlak003";
}
