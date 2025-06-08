import { NextRequest, NextResponse } from "next/server";
import { nylas, nylasConfig } from "@/lib/nlyas";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Received token exchange request");
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify user is authenticated
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

    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.callbackUri,
      code,
    });

    const { grantId } = response;

    console.log("Grant ID:", grantId);

    // Store the Nylas connection in Supabase
    const { error: connectionError } = await supabase
      .from("calendar_connections")
      .upsert({
        user_id: user.id,
        provider: "nylas",
        access_token: response.accessToken,
        refresh_token: response.refreshToken,
        token_expiry: new Date(
          Date.now() + response.expiresIn * 1000
        ).toISOString(),
        grant_id: grantId,
        updated_at: new Date().toISOString(),
      });

    if (connectionError) {
      console.error("Error storing Nylas connection:", connectionError);
      return NextResponse.json(
        { error: "Failed to store Nylas connection" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "OAuth2 flow completed successfully",
      grantId,
    });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.json(
      { error: "Failed to exchange code for token" },
      { status: 500 }
    );
  }
}
