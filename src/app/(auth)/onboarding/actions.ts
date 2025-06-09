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

  // Extract form data - simplified to just the two questions
  const userType = formData.get("userType") as string;
  const referralSource = formData.get("referralSource") as string;
  const paymentCompleted = formData.get("paymentCompleted") === "true";

  // Set default values for fields we no longer ask about
  const teamSize = null; // No longer asking this
  const audioPurpose = null; // No longer asking this
  const micPermission = true; // Default to true

  try {
    // Check if onboarding record already exists
    const { data: existingOnboarding } = await supabase
      .from("user_onboarding")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const onboardingData = {
      user_id: user.id,
      answers: {
        userType,
        referralSource,
        // Keep the structure but set defaults for removed fields
        teamSize: null,
        audioPurpose: null,
        micPermission,
      },
      payment_completed: paymentCompleted,
      user_type: userType,
      team_size: teamSize,
      referral_source: referralSource,
      audio_purpose: audioPurpose,
      mic_permission: micPermission,
      // Don't set completed_at yet - that happens in finalizeOnboarding
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
      onboarding_completed: false, // Set to false since calendar connection is still needed
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile update error:", profileError);
      // Don't return error here as onboarding data was saved successfully
    }

    console.log("✅ Onboarding answers saved successfully for user:", user.id, {
      userType,
      referralSource,
    });

    revalidatePath("/", "layout");

    // Don't redirect here - let the frontend handle the redirect to calendar connection
    return { success: true, message: "Answers submitted successfully" };
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

// Function to mark onboarding as fully completed (after calendar connection)
export async function finalizeOnboarding(userId: string) {
  const supabase = await createClient();

  try {
    // Update the onboarding record to mark it as completed
    const { error } = await supabase
      .from("user_onboarding")
      .update({
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error finalizing onboarding:", error);
      return { error: error.message };
    }

    // Update the profile to mark onboarding as completed
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating profile onboarding status:", profileError);
      // Don't return error here as the main onboarding was completed
    }

    console.log("✅ Onboarding finalized successfully for user:", userId);

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (error) {
    console.error("Unexpected error finalizing onboarding:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
