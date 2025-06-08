import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Starting Nylas OAuth callback handler...");
    const supabase = await createClient();

    // Get the authorization code from the URL
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(
        new URL("/dashboard?error=No authorization code received", request.url)
      );
    }

    console.log("Received authorization code, verifying user...");

    // Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return NextResponse.redirect(
        new URL("/dashboard?error=User not authenticated", request.url)
      );
    }

    console.log("User authenticated, exchanging code for token...", {
      userId: user.id,
    });

    // Exchange code for token
    const response = await fetch(
      new URL("/api/auth/nylas/token", request.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to exchange code for token:", error);
      return NextResponse.redirect(
        new URL(
          "/dashboard?error=Failed to connect Google Calendar",
          request.url
        )
      );
    }

    const { grantId } = await response.json();

    console.log("Successfully connected Nylas calendar", {
      userId: user.id,
      grantId,
    });

    // Redirect back to dashboard with success message
    return NextResponse.redirect(
      new URL("/dashboard?success=Calendar connected successfully", request.url)
    );
  } catch (error) {
    console.error("Unexpected error in Nylas callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=An unexpected error occurred", request.url)
    );
  }
}
