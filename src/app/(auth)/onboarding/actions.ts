// src/app/(auth)/onboarding/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: formData.get("fullName") as string,
    username: formData.get("username") as string,
    bio: formData.get("bio") as string,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    redirect("/error?message=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Extract form data
  const userType = formData.get("userType") as string;
  const teamSize = formData.get("teamSize") as string;
  const referralSource = formData.get("referralSource") as string;
  const audioPurpose = formData.get("audioPurpose") as string;
  const paymentCompleted = formData.get("paymentCompleted") === "true";
  const micPermission = formData.get("micPermission") === "true";

  try {
    // Check if onboarding record already exists
    const { data: existingOnboarding } = await supabase
      .from("user_onboarding")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const onboardingData = {
      user_id: user.id,
      completed_at: new Date().toISOString(),
      answers: {
        userType,
        teamSize,
        referralSource,
        audioPurpose,
        micPermission,
      },
      payment_completed: paymentCompleted,
      user_type: userType,
      team_size: teamSize,
      referral_source: referralSource,
      audio_purpose: audioPurpose,
      mic_permission: micPermission,
      updated_at: new Date().toISOString(),
    };

    let onboardingError;

    if (existingOnboarding) {
      // Update existing record
      const { error } = await supabase
        .from("user_onboarding")
        .update(onboardingData)
        .eq("user_id", user.id);
      onboardingError = error;
    } else {
      // Insert new record (shouldn't happen in normal flow, but handle it)
      const { error } = await supabase.from("user_onboarding").insert({
        ...onboardingData,
        payment_link_tag: user.user_metadata?.payment_link_tag || null,
      });
      onboardingError = error;
    }

    if (onboardingError) {
      console.error("Onboarding error:", onboardingError);
      return { error: onboardingError.message };
    }

    // Update user profile if needed
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile update error:", profileError);
      // Don't return error here as onboarding data was saved successfully
    }

    console.log("✅ Onboarding completed successfully for user:", user.id);

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (error) {
    console.error("Unexpected error during onboarding:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function checkPaymentStatus(userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user_onboarding")
      .select("payment_completed, payment_link_tag")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = Row not found
      throw error;
    }

    return {
      paymentCompleted: data?.payment_completed || false,
      paymentLinkTag: data?.payment_link_tag || null,
    };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return {
      paymentCompleted: false,
      paymentLinkTag: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check payment status",
    };
  }
}

// New function to verify payment completion (can be called from Stripe webhook)
export async function markPaymentCompleted(
  userId: string,
  stripeSessionId?: string
) {
  const supabase = await createClient();

  try {
    const updateData: any = {
      payment_completed: true,
      updated_at: new Date().toISOString(),
    };

    if (stripeSessionId) {
      updateData.stripe_session_id = stripeSessionId;
    }

    const { error } = await supabase
      .from("user_onboarding")
      .update(updateData)
      .eq("user_id", userId);

    if (error) {
      console.error("Error marking payment as completed:", error);
      return { error: error.message };
    }

    console.log("✅ Payment marked as completed for user:", userId);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error marking payment as completed:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
