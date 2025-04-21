import { createClient } from "@/utils/supabase/server";

/**
 * Check if a user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_onboarding")
    .select("completed_at")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

/**
 * Gets a user's onboarding data
 */
export async function getUserOnboardingData(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_onboarding")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching onboarding data:", error);
    return null;
  }

  return data;
}
