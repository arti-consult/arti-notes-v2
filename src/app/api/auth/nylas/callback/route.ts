// src/app/api/auth/nylas/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Starting Nylas OAuth callback handler...");
    const supabase = await createClient();

    // Get the authorization code from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // Contains user ID
    const error = url.searchParams.get("error");

    console.log("📝 Callback received:", {
      code: code ? `${code.substring(0, 20)}...` : null,
      state,
      error,
      fullUrl: request.url,
    });

    if (error) {
      console.error("❌ OAuth error:", error);
      return NextResponse.redirect(
        new URL(
          `/onboarding?error=Calendar connection failed: ${error}`,
          request.url
        )
      );
    }

    if (!code) {
      console.error("❌ No authorization code received");
      return NextResponse.redirect(
        new URL("/onboarding?error=No authorization code received", request.url)
      );
    }

    // Get user ID from session (more reliable than state)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ User not authenticated:", userError);
      return NextResponse.redirect(
        new URL("/login?error=User not authenticated", request.url)
      );
    }

    const userId = user.id;
    console.log("👤 Processing callback for user:", userId);

    // Exchange code for token
    console.log("🔄 Calling token exchange endpoint...");
    const tokenResponse = await fetch(
      new URL("/api/auth/nylas/token", request.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, userId }),
      }
    );

    console.log("📡 Token response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("❌ Failed to exchange code for token:", errorData);
      return NextResponse.redirect(
        new URL(
          `/onboarding?error=Failed to connect calendar: ${errorData.error}`,
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();
    const { grantId, accessToken } = tokenData;

    console.log("✅ Token exchange successful:", {
      grantId,
      hasAccessToken: !!accessToken,
      tokenDataKeys: Object.keys(tokenData),
    });

    if (!grantId) {
      console.error("❌ No grant ID received from token exchange");
      return NextResponse.redirect(
        new URL("/onboarding?error=No grant ID received", request.url)
      );
    }

    // Update user's profile with grant ID and calendar connection status
    console.log("🔄 Updating profile with grant ID...");
    try {
      const { data: updateData, error: profileError } = await supabase
        .from("profiles")
        .update({
          nylas_grant_id: grantId,
          calendar_connected: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select();

      if (profileError) {
        console.error("❌ Profile update failed:", profileError);

        // Try upsert as fallback
        console.log("🔄 Trying upsert fallback...");
        const { data: upsertData, error: upsertError } = await supabase
          .from("profiles")
          .upsert({
            id: userId,
            nylas_grant_id: grantId,
            calendar_connected: true,
            updated_at: new Date().toISOString(),
          })
          .select();

        if (upsertError) {
          console.error("❌ Upsert also failed:", upsertError);
        } else {
          console.log("✅ Upsert succeeded:", upsertData);
        }
      } else {
        console.log("✅ Profile updated successfully:", updateData);
      }
    } catch (error) {
      console.error("❌ Exception updating profile:", error);
    }

    // Also update onboarding record
    console.log("🔄 Updating onboarding record...");
    try {
      const { data: onboardingData, error: onboardingError } = await supabase
        .from("user_onboarding")
        .update({
          calendar_connected: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select();

      if (onboardingError) {
        console.error("❌ Onboarding update failed:", onboardingError);
      } else {
        console.log("✅ Onboarding updated successfully:", onboardingData);
      }
    } catch (error) {
      console.error("❌ Exception updating onboarding:", error);
    }

    // Check onboarding completion status
    const { data: onboarding } = await supabase
      .from("user_onboarding")
      .select("completed_at")
      .eq("user_id", userId)
      .maybeSingle();

    const redirectPath = onboarding?.completed_at
      ? "/dashboard"
      : "/onboarding";

    console.log("🏁 Redirecting to:", redirectPath);

    // Redirect with success message and grant ID
    return NextResponse.redirect(
      new URL(
        `${redirectPath}?calendar=connected&grant_id=${grantId}`,
        request.url
      )
    );
  } catch (error) {
    console.error("💥 Unexpected error in Nylas callback:", error);
    return NextResponse.redirect(
      new URL("/onboarding?error=An unexpected error occurred", request.url)
    );
  }
}
