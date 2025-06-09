"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  console.log("=== SIGNUP ACTION START ===", new Date().toISOString());

  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const email = formData.get("email") as string;
  const productTag = formData.get("productTag") as string;

  console.log(
    "Signup attempt for email:",
    email,
    "with product tag:",
    productTag
  );

  // Validate password match
  if (password !== confirmPassword) {
    console.log("Password mismatch");
    return { error: "Passwords do not match" };
  }

  const data = {
    email: email,
    password: password,
    options: {
      data: {
        product_tag: productTag || null, // Store in user metadata
      },
    },
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
          product_tag: authData.user.user_metadata?.product_tag,
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
    console.log(
      "User created with session, proceeding to create onboarding record"
    );

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

    // Create initial onboarding record with product tag
    try {
      const { error: onboardingError } = await supabase
        .from("user_onboarding")
        .insert({
          user_id: authData.user?.id,
          payment_completed: false,
          product_tag: productTag || null,
          // Make all fields explicitly nullable
          user_type: null,
          team_size: null,
          referral_source: null,
          audio_purpose: null,
          mic_permission: false, // Default value
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (onboardingError) {
        console.error("Error creating onboarding record:", onboardingError);
        // Don't fail signup, but log the error
      } else {
        console.log(
          "Created initial onboarding record with product tag:",
          productTag
        );
      }
    } catch (error) {
      console.error("Exception creating onboarding record:", error);
    }

    console.log("Calling revalidatePath...");
    revalidatePath("/", "layout");

    // Return success with product tag for frontend to handle redirect
    console.log("Signup successful, returning success response");
    return {
      success: true,
      productTag: productTag,
      user: authData.user,
    };
  }

  // Fallback - shouldn't happen but handle it
  console.log("Unexpected signup state - no session created");
  return {
    error:
      "Signup completed but no session was created. Please try logging in.",
  };
}

export async function signInWithGoogle(productTag?: string | null) {
  console.log("=== GOOGLE SIGNIN START ===", "Product tag:", productTag);
  const supabase = await createClient();

  // Build redirect URL with product tag if present
  const redirectUrl = productTag
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?p=${productTag}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  });

  console.log("Google OAuth result:", {
    hasUrl: !!data.url,
    url: data.url,
    error: error?.message,
    redirectTo: redirectUrl,
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

export async function signInWithMicrosoft(productTag?: string | null) {
  console.log("=== MICROSOFT SIGNIN START ===", "Product tag:", productTag);
  const supabase = await createClient();

  // Build redirect URL with product tag if present
  const redirectUrl = productTag
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?p=${productTag}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      redirectTo: redirectUrl,
    },
  });

  console.log("Microsoft OAuth result:", {
    hasUrl: !!data.url,
    url: data.url,
    error: error?.message,
    redirectTo: redirectUrl,
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
