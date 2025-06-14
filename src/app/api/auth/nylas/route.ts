// src/app/api/auth/nylas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { nylas, nylasConfig } from "@/lib/nlyas";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Starting Nylas OAuth flow...");
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("User not authenticated:", error);
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!nylasConfig.clientId || !nylasConfig.callbackUri) {
      console.error("Missing Nylas configuration");
      return NextResponse.json(
        { error: "Missing Nylas configuration" },
        { status: 500 }
      );
    }

    // Generate Nylas OAuth URL with correct callback
    const authUrl = nylas.auth.urlForOAuth2({
      clientId: nylasConfig.clientId,
      redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/nylas/callback`, // Fixed callback URL
      scope: [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      state: user.id, // Pass user ID in state for tracking
    });

    console.log("Generated Nylas OAuth URL:", authUrl);

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error("Error in Nylas auth route:", error);
    return NextResponse.json(
      { error: "Failed to generate Nylas auth URL" },
      { status: 500 }
    );
  }
}
