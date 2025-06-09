// src/utils/calendar/background-sync.ts
import { createClient } from "@/utils/supabase/server";
import { syncGoogleCalendarEvents } from "./google-calendar";

export interface SyncResult {
  success: boolean;
  syncedUsers: number;
  errors: Array<{ userId: string; error: string }>;
}

export async function syncUserCalendar(
  userId: string,
  daysAhead: number = 30
): Promise<boolean> {
  try {
    console.log(`Starting calendar sync for user: ${userId}`);

    const supabase = await createClient();

    // Check if user has a Google Calendar connection
    const { data: connection, error: connectionError } = await supabase
      .from("calendar_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    if (connectionError || !connection) {
      console.log(`No Google Calendar connection found for user: ${userId}`);
      return false;
    }

    // Sync Google Calendar events
    const syncSuccess = await syncGoogleCalendarEvents(userId, daysAhead);

    if (!syncSuccess) {
      console.error(`Failed to sync Google Calendar for user: ${userId}`);
      return false;
    }

    console.log(`Successfully synced calendar for user: ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error syncing calendar for user ${userId}:`, error);
    return false;
  }
}

export async function syncAllUserCalendars(
  daysAhead: number = 30
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    syncedUsers: 0,
    errors: [],
  };

  try {
    console.log("Starting sync for all users with calendar connections");

    const supabase = await createClient();

    // Get all users with Google Calendar connections
    const { data: connections, error: connectionsError } = await supabase
      .from("calendar_connections")
      .select("user_id")
      .eq("provider", "google");

    if (connectionsError) {
      console.error("Error fetching calendar connections:", connectionsError);
      result.success = false;
      return result;
    }

    if (!connections || connections.length === 0) {
      console.log("No users with calendar connections found");
      return result;
    }

    console.log(`Found ${connections.length} users with calendar connections`);

    // Sync each user's calendar
    for (const connection of connections) {
      try {
        const syncSuccess = await syncUserCalendar(
          connection.user_id,
          daysAhead
        );

        if (syncSuccess) {
          result.syncedUsers++;
        } else {
          result.errors.push({
            userId: connection.user_id,
            error: "Failed to sync calendar",
          });
        }
      } catch (error) {
        console.error(
          `Error syncing calendar for user ${connection.user_id}:`,
          error
        );
        result.errors.push({
          userId: connection.user_id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Set overall success based on whether any sync succeeded
    result.success = result.syncedUsers > 0 || result.errors.length === 0;

    console.log(
      `Sync completed. Successful: ${result.syncedUsers}, Errors: ${result.errors.length}`
    );

    return result;
  } catch (error) {
    console.error("Error in syncAllUserCalendars:", error);
    result.success = false;
    result.errors.push({
      userId: "all",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return result;
  }
}

export async function getCalendarEvents(
  userId: string,
  daysAhead: number = 7,
  hasMeetingLinkOnly: boolean = false
): Promise<any[]> {
  try {
    const supabase = await createClient();

    // Calculate date range
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + daysAhead);

    // Build query
    let query = supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", userId)
      .gte("start_time", now.toISOString())
      .lte("start_time", future.toISOString())
      .order("start_time", { ascending: true });

    // Filter by meeting link if requested
    if (hasMeetingLinkOnly) {
      query = query.not("meeting_link", "is", null);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error("Error fetching calendar events:", error);
      return [];
    }

    return events || [];
  } catch (error) {
    console.error("Error in getCalendarEvents:", error);
    return [];
  }
}

export async function deleteCalendarEvents(
  userId: string,
  provider: string = "google"
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq("user_id", userId)
      .eq("provider", provider);

    if (error) {
      console.error("Error deleting calendar events:", error);
      return false;
    }

    console.log(
      `Deleted calendar events for user: ${userId}, provider: ${provider}`
    );
    return true;
  } catch (error) {
    console.error("Error in deleteCalendarEvents:", error);
    return false;
  }
}
