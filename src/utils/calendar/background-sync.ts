// src/utils/calendar/background-sync.ts
import { createClient } from "@/utils/supabase/server";
import { syncGoogleCalendarEvents } from "@/utils/calendar/google-calendar";
import {
  createMeetingsFromCalendarEvents,
  updateMeetingsFromCalendarEvents,
} from "@/services/calendarEventService";

/**
 * Perform a complete calendar sync for a specific user
 */
export async function syncUserCalendar(userId: string): Promise<boolean> {
  try {
    console.log(`Starting calendar sync for user ${userId}...`);
    const supabase = await createClient();

    // 1. Verify calendar connection
    const { data: connection, error: connectionError } = await supabase
      .from("calendar_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    if (connectionError || !connection) {
      console.error("No valid calendar connection found:", connectionError);
      return false;
    }

    console.log("Found valid calendar connection:", {
      connectionId: connection.id,
      provider: connection.provider,
      lastSync: connection.last_sync,
    });

    // 2. Sync Google Calendar events
    console.log("Starting Google Calendar sync...");
    const calendarSyncSuccess = await syncGoogleCalendarEvents(userId);

    if (!calendarSyncSuccess) {
      console.error("Failed to sync Google Calendar events");
      return false;
    }

    console.log("Google Calendar events synced successfully");

    // 3. Create meetings from calendar events with meeting links
    console.log("Creating meetings from calendar events...");
    const createdMeetings = await createMeetingsFromCalendarEvents();
    console.log(`Created ${createdMeetings} meetings from calendar events`);

    // 4. Update existing meetings if calendar events have changed
    console.log("Updating existing meetings...");
    const updatedMeetings = await updateMeetingsFromCalendarEvents();
    console.log(`Updated ${updatedMeetings} existing meetings`);

    // 5. Update last sync timestamp
    console.log("Updating last sync timestamp...");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ last_calendar_sync: new Date().toISOString() })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update last sync timestamp:", updateError);
    }

    // 6. Get final event count
    console.log("Getting final event count...");
    const {
      data: events,
      count,
      error: countError,
    } = await supabase
      .from("calendar_events")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    console.log("Calendar sync completed successfully", {
      userId,
      totalEvents: count,
      createdMeetings,
      updatedMeetings,
      events: events?.map((e) => ({
        id: e.id,
        title: e.title,
        start_time: e.start_time,
      })),
      error: countError,
    });

    return true;
  } catch (error) {
    console.error("Error in complete user calendar sync:", error);
    return false;
  }
}

/**
 * Sync calendar events for all users based on their preferred sync frequency
 */
export async function syncAllUserCalendars(): Promise<{
  success: boolean;
  syncedUsers: number;
}> {
  try {
    const supabase = await createClient();

    // Get all users with their sync frequency
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        calendar_sync_frequency,
        last_calendar_sync
      `
      )
      .not("calendar_sync_frequency", "eq", "manual");

    if (error) {
      console.error("Error fetching user profiles:", error);
      return { success: false, syncedUsers: 0 };
    }

    if (!profiles || profiles.length === 0) {
      return { success: true, syncedUsers: 0 };
    }

    let syncedUsers = 0;
    const now = new Date();

    // Process each user based on their sync frequency
    for (const profile of profiles) {
      // Skip if no sync frequency
      if (!profile.calendar_sync_frequency) continue;

      const lastSync = profile.last_calendar_sync
        ? new Date(profile.last_calendar_sync)
        : null;
      let shouldSync = false;

      // Determine if we should sync based on frequency
      switch (profile.calendar_sync_frequency) {
        case "realtime":
          shouldSync = true;
          break;
        case "hourly":
          shouldSync =
            !lastSync || now.getTime() - lastSync.getTime() >= 60 * 60 * 1000;
          break;
        case "daily":
          shouldSync =
            !lastSync ||
            now.getTime() - lastSync.getTime() >= 24 * 60 * 60 * 1000;
          break;
        case "weekly":
          shouldSync =
            !lastSync ||
            now.getTime() - lastSync.getTime() >= 7 * 24 * 60 * 60 * 1000;
          break;
        default:
          shouldSync = false;
      }

      if (shouldSync) {
        // Use the new syncUserCalendar function for consistency
        const success = await syncUserCalendar(profile.id);
        if (success) {
          syncedUsers++;
        }
      }
    }

    return { success: true, syncedUsers };
  } catch (error) {
    console.error("Error syncing user calendars:", error);
    return { success: false, syncedUsers: 0 };
  }
}
