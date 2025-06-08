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
      // Insert new record
      const { error } = await supabase
        .from("user_onboarding")
        .insert(onboardingData);
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
      .select("payment_completed")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = Row not found
      throw error;
    }

    return {
      paymentCompleted: data?.payment_completed || false,
    };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return {
      paymentCompleted: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check payment status",
    };
  }
}
