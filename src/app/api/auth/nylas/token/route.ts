// src/app/api/auth/nylas/token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { nylas, nylasConfig } from "@/lib/nlyas";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Received token exchange request");
    const { code, userId } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify user is authenticated (fallback if userId not provided)
    let finalUserId = userId;
    if (!finalUserId) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not authenticated:", userError);
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      finalUserId = user.id;
    }

    if (
      !nylasConfig.apiKey ||
      !nylasConfig.clientId ||
      !nylasConfig.callbackUri
    ) {
      return NextResponse.json(
        { error: "Missing required Nylas environment variables" },
        { status: 500 }
      );
    }

    console.log("Exchanging code for token with Nylas...");

    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/nylas/callback`,
      code,
    });

    const { grantId, accessToken, refreshToken, expiresIn } = response;

    console.log("Token exchange successful:", {
      grantId,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      expiresIn,
    });

    // Save the grant ID directly to the profiles table instead of calendar_connections
    console.log("🔄 Saving grant ID to profiles table for user:", finalUserId);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({
          nylas_grant_id: grantId,
          calendar_connected: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", finalUserId)
        .select();

      if (profileError) {
        console.error("❌ Error updating profile with grant ID:", profileError);
        return NextResponse.json(
          { error: "Failed to save grant ID to profile" },
          { status: 500 }
        );
      }

      console.log("✅ Successfully saved grant ID to profile:", profileData);

      // Also update onboarding record
      const { error: onboardingError } = await supabase
        .from("user_onboarding")
        .update({
          calendar_connected: true,
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq("user_id", finalUserId);

      if (onboardingError) {
        console.log(
          "⚠️ Could not update onboarding record:",
          onboardingError.message
        );
        // Don't fail the whole flow for this
      } else {
        console.log("✅ Updated onboarding record with calendar connection");
      }
    } catch (error) {
      console.error("💥 Exception saving grant ID:", error);
      return NextResponse.json(
        { error: "Exception occurred while saving grant ID" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "OAuth2 flow completed successfully",
      grantId,
      accessToken, // Include access token in response
      profileUpdated: true,
    });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.json(
      {
        error: "Failed to exchange code for token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
