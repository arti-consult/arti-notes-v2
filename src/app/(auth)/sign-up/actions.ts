"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function signup(formData: FormData) {
  console.log("=== SIGNUP ACTION START ===", new Date().toISOString());

  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const email = formData.get("email") as string;

  console.log("Signup attempt for email:", email);

  // Validate password match
  if (password !== confirmPassword) {
    console.log("Password mismatch");
    return { error: "Passwords do not match" };
  }

  const data = {
    email: email,
    password: password,
  };

  console.log("Calling supabase.auth.signUp...");
  const signUpStartTime = Date.now();

  const { data: authData, error } = await supabase.auth.signUp(data);

  const signUpEndTime = Date.now();
  console.log(`SignUp completed in ${signUpEndTime - signUpStartTime}ms`);

  console.log("SignUp result:", {
    user: authData.user
      ? {
          id: authData.user.id,
          email: authData.user.email,
          email_confirmed_at: authData.user.email_confirmed_at,
          created_at: authData.user.created_at,
        }
      : null,
    session: authData.session
      ? {
          access_token: authData.session.access_token ? "present" : "missing",
          refresh_token: authData.session.refresh_token ? "present" : "missing",
          expires_at: authData.session.expires_at,
          user_id: authData.session.user?.id,
        }
      : null,
    error: error?.message,
  });

  if (error) {
    console.log("Signup error:", error.message);
    return { error: error.message };
  }

  // Check if user was created but needs email confirmation
  if (authData.user && !authData.session) {
    console.log("User created but no session - needs email confirmation");
    return {
      success: true,
      needsConfirmation: true,
      message:
        "Please check your email and click the confirmation link to continue.",
    };
  }

  // Check if we have a session
  if (authData.session) {
    console.log("User created with session, proceeding to redirect");

    // Ensure session cookies are properly set by setting the session explicitly
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    });

    if (setSessionError) {
      console.error("Error setting session:", setSessionError);
    } else {
      console.log("Session explicitly set on server");
    }

    // Refresh the session to ensure it's properly synchronized
    const { data: refreshedSession, error: refreshError } =
      await supabase.auth.getSession();
    console.log("Session refresh result:", {
      hasSession: !!refreshedSession.session,
      error: refreshError?.message,
    });

    // Create initial onboarding record to avoid confusion in middleware
    try {
      const { error: onboardingError } = await supabase
        .from("user_onboarding")
        .insert({
          user_id: authData.user?.id,
          payment_completed: false,
          // Add required fields with default values
          user_type: "individual", // Default value
          team_size: null,
          referral_source: null,
          audio_purpose: null,
          mic_permission: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (onboardingError) {
        console.log(
          "Note: Could not create initial onboarding record:",
          onboardingError.message
        );
        // Don't fail the signup for this - it's not critical
      } else {
        console.log("Created initial onboarding record");
      }
    } catch (error) {
      console.log("Exception creating onboarding record:", error);
    }

    console.log("Calling revalidatePath...");
    revalidatePath("/", "layout");

    console.log("About to redirect to session debug page");
    redirect("/session-debug");
  }

  // Fallback - shouldn't happen but handle it
  console.log("Unexpected signup state - no session created");
  return {
    error:
      "Signup completed but no session was created. Please try logging in.",
  };
}

export async function signInWithGoogle() {
  console.log("=== GOOGLE SIGNIN START ===");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/payment`,
    },
  });

  console.log("Google OAuth result:", {
    hasUrl: !!data.url,
    url: data.url,
    error: error?.message,
  });

  if (error) {
    console.log("Google OAuth error:", error);
    redirect("/error?message=" + encodeURIComponent(error.message));
  }

  // For OAuth, the redirect happens automatically
  if (data.url) {
    console.log("Redirecting to Google OAuth URL");
    redirect(data.url);
  }
}

export async function signInWithMicrosoft() {
  console.log("=== MICROSOFT SIGNIN START ===");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/payment`,
    },
  });

  console.log("Microsoft OAuth result:", {
    hasUrl: !!data.url,
    url: data.url,
    error: error?.message,
  });

  if (error) {
    console.log("Microsoft OAuth error:", error);
    redirect("/error?message=" + encodeURIComponent(error.message));
  }

  // For OAuth, the redirect happens automatically
  if (data.url) {
    console.log("Redirecting to Microsoft OAuth URL");
    redirect(data.url);
  }
}
