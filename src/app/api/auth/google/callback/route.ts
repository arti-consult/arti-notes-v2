import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { handleGoogleCallback } from "@/utils/calendar/google-calendar";
import { syncUserCalendar } from "@/utils/calendar/background-sync";

export async function GET(request: NextRequest) {
  try {
    console.log("Starting Google OAuth callback handler...");
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

    console.log("User authenticated, handling Google callback...", {
      userId: user.id,
    });

    // Handle the Google callback and store tokens
    const success = await handleGoogleCallback(code);

    if (!success) {
      console.error("Failed to handle Google callback");
      return NextResponse.redirect(
        new URL(
          "/dashboard?error=Failed to connect Google Calendar",
          request.url
        )
      );
    }

    console.log(
      "Successfully stored Google Calendar tokens, initiating sync..."
    );

    // Verify calendar connection was created
    const { data: connection, error: connectionError } = await supabase
      .from("calendar_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "google")
      .single();

    if (connectionError || !connection) {
      console.error("Failed to verify calendar connection:", connectionError);
      return NextResponse.redirect(
        new URL(
          "/dashboard?error=Calendar connection verification failed",
          request.url
        )
      );
    }

    console.log("Calendar connection verified, starting sync...");

    // Trigger immediate sync for 30 days ahead
    const syncSuccess = await syncUserCalendar(user.id);

    if (!syncSuccess) {
      console.error("Initial calendar sync failed");
      return NextResponse.redirect(
        new URL(
          "/dashboard?success=Calendar connected but sync failed. Please try manual sync.",
          request.url
        )
      );
    }

    // Verify events were synced
    const { count, error: eventCountError } = await supabase
      .from("calendar_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    console.log("Sync completed, event count:", {
      count,
      error: eventCountError,
    });

    // Redirect back to dashboard with success message
    const successMessage = count
      ? `Calendar connected and synced successfully. Found ${count} events.`
      : "Calendar connected successfully but no events found.";

    const redirectUrl = new URL("/dashboard", request.url);
    redirectUrl.searchParams.set("success", successMessage);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Unexpected error in Google callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=An unexpected error occurred", request.url)
    );
  }
}
