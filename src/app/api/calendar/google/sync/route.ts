import { NextRequest, NextResponse } from "next/server";
import { syncUserCalendar } from "@/utils/calendar/background-sync";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting calendar sync endpoint...");

    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("User authenticated, checking calendar connection...", {
      userId: user.id,
    });

    // Verify calendar connection exists
    const { data: connection, error: connectionError } = await supabase
      .from("calendar_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "google")
      .single();

    if (connectionError || !connection) {
      console.error("No calendar connection found:", connectionError);
      return NextResponse.json(
        { error: "No calendar connection found" },
        { status: 404 }
      );
    }

    console.log("Calendar connection found, starting sync...", {
      userId: user.id,
      connectionId: connection.id,
      provider: connection.provider,
    });

    // Get request body
    const body = await request.json();
    const daysAhead = body.daysAhead || 30; // Default to 30 days if not specified

    console.log(`Syncing calendar events for next ${daysAhead} days...`);

    // Sync calendar events
    const success = await syncUserCalendar(user.id);

    if (!success) {
      console.error("Calendar sync failed");
      return NextResponse.json(
        { error: "Failed to sync calendar events" },
        { status: 500 }
      );
    }

    // Verify events were synced
    const {
      data: events,
      count,
      error: eventCountError,
    } = await supabase
      .from("calendar_events")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    console.log("Sync completed successfully", {
      eventCount: count,
      error: eventCountError,
      events: events?.map((e) => ({
        id: e.id,
        title: e.title,
        start_time: e.start_time,
      })),
    });

    return NextResponse.json({
      success: true,
      message: `Calendar synced successfully. Found ${count || 0} events.`,
    });
  } catch (error) {
    console.error("Error in calendar sync endpoint:", error);
    return NextResponse.json(
      {
        error: "Failed to sync calendar events",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
