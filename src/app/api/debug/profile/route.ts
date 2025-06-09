// src/app/api/debug/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get user's calendar connections
    const { data: connections, error: connectionsError } = await supabase
      .from("calendar_connections")
      .select("*")
      .eq("user_id", user.id);

    // Get user's onboarding data
    const { data: onboarding, error: onboardingError } = await supabase
      .from("user_onboarding")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      profile: {
        data: profile,
        error: profileError?.message,
      },
      connections: {
        data: connections,
        error: connectionsError?.message,
      },
      onboarding: {
        data: onboarding,
        error: onboardingError?.message,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Exception occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST endpoint to manually update profile for testing
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { grantId } = await request.json();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!grantId) {
      return NextResponse.json({ error: "Grant ID required" }, { status: 400 });
    }

    // Try to update profile
    const { data, error } = await supabase
      .from("profiles")
      .update({
        nylas_grant_id: grantId,
        calendar_connected: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Profile update error:", error);

      // Try upsert instead
      const { data: upsertData, error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          nylas_grant_id: grantId,
          calendar_connected: true,
          updated_at: new Date().toISOString(),
        })
        .select();

      return NextResponse.json({
        updateResult: { data, error: error.message },
        upsertResult: { data: upsertData, error: upsertError?.message },
      });
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Exception occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
