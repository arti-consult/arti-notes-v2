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

  // Save onboarding data
  const { error: onboardingError } = await supabase
    .from("user_onboarding")
    .upsert({
      user_id: user.id,
      completed_at: new Date().toISOString(),
      // Add any other onboarding data you want to save
      answers: {
        // Add your form fields here
        question1: formData.get("question1"),
        question2: formData.get("question2"),
        // ... add more questions as needed
      },
      updated_at: new Date().toISOString(),
    });

  if (onboardingError) {
    return { error: onboardingError.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
