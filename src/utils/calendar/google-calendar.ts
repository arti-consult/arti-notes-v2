// src/utils/calendar/google-calendar.ts
import { google } from "googleapis";
import { createClient as createClientClient } from "@/utils/supabase/client";
import { createClient as createClientServer } from "@/utils/supabase/server";
import { CalendarEvent } from "@/types/calendar";
import { getGoogleAccessToken } from "./auth";

// Google OAuth scopes needed
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
];

// Google Calendar API credentials
const credentials = {
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
  client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
  redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
};

// Debug log the credentials and environment
console.log("Environment check:", {
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  hasClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
});

console.log("Google OAuth Configuration:", {
  redirectUri: credentials.redirect_uri,
  hasClientId: !!credentials.client_id,
  hasClientSecret: !!credentials.client_secret,
  scopes: SCOPES,
});

/**
 * Create OAuth2 client for Google API
 */
export function createOAuth2Client() {
  const client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uri
  );

  console.log(
    "Created OAuth2 client with redirect URI:",
    credentials.redirect_uri
  );

  return client;
}

/**
 * Generate Google OAuth URL for user authorization
 */
export function getGoogleAuthUrl(): string {
  console.log("Generating Google OAuth URL...");
  const oauth2Client = createOAuth2Client();

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force to get refresh token
    include_granted_scopes: true,
  });

  console.log("Generated OAuth URL:", url);
  return url;
}

/**
 * Exchange authorization code for tokens and save to Supabase
 */
export async function handleGoogleCallback(code: string): Promise<boolean> {
  try {
    const supabase = await createClientServer();
    const oauth2Client = createOAuth2Client();

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      console.error("Missing required tokens from Google");
      return false;
    }

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated");
      return false;
    }

    console.log("Saving Google Calendar connection...");

    // First, check if a connection already exists
    const { data: existingConnection } = await supabase
      .from("calendar_connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", "google")
      .single();

    // Store tokens in Supabase calendar_connections table
    const connectionData = {
      user_id: user.id,
      provider: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expiry: tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null,
      scope: SCOPES.join(" "),
      updated_at: new Date().toISOString(),
    };

    let error;
    if (existingConnection) {
      // Update existing connection
      const { error: updateError } = await supabase
        .from("calendar_connections")
        .update(connectionData)
        .eq("id", existingConnection.id);
      error = updateError;
    } else {
      // Create new connection
      const { error: insertError } = await supabase
        .from("calendar_connections")
        .insert({
          ...connectionData,
          created_at: new Date().toISOString(),
        });
      error = insertError;
    }

    if (error) {
      console.error("Error storing tokens:", error);
      return false;
    }

    console.log("Successfully stored Google Calendar connection");
    return true;
  } catch (error) {
    console.error("Error handling Google callback:", error);
    return false;
  }
}

/**
 * Refresh tokens if needed
 */
export async function refreshTokenIfNeeded(userId: string): Promise<boolean> {
  try {
    const supabase = createClientClient();

    // Get stored tokens from calendar_connections
    const { data, error } = await supabase
      .from("calendar_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    if (error || !data) {
      console.error("No Google Calendar connection found");
      return false;
    }

    // Check if token is expired
    const tokenExpiry = new Date(data.token_expiry);
    const now = new Date();

    if (tokenExpiry <= now && data.refresh_token) {
      console.log("Refreshing expired token...");

      // Token is expired, refresh it
      const oauth2Client = createOAuth2Client();
      oauth2Client.setCredentials({
        refresh_token: data.refresh_token,
      });

      const response = await oauth2Client.getAccessToken();
      const token = response.token;
      const expiryDate = oauth2Client.credentials.expiry_date;

      // Update tokens in database
      const { error: updateError } = await supabase
        .from("calendar_connections")
        .update({
          access_token: token,
          token_expiry: expiryDate ? new Date(expiryDate).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("provider", "google");

      if (updateError) {
        console.error("Error updating tokens:", updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

/**
 * Fetch upcoming calendar events from Google Calendar
 */
export async function fetchUpcomingGoogleEvents(
  userId: string,
  daysAhead = 30
): Promise<CalendarEvent[]> {
  try {
    console.log(`Fetching Google Calendar events for user ${userId}...`);

    // Get access token
    const accessToken = await getGoogleAccessToken(userId);
    if (!accessToken) {
      console.error("Failed to get access token");
      return [];
    }
    console.log("✓ Successfully got access token");

    // Setup OAuth client with token
    console.log("Setting up OAuth client...");
    const oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uri
    );
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Calculate time range
    const now = new Date();
    const timeMin = now.toISOString();
    const future = new Date();
    future.setDate(future.getDate() + daysAhead);
    const timeMax = future.toISOString();

    console.log(`Fetching events from ${timeMin} to ${timeMax}`);

    // Fetch calendar list first
    console.log("Fetching calendar list...");
    const {
      data: { items: calendarList },
    } = await calendar.calendarList.list();

    if (!calendarList || calendarList.length === 0) {
      console.log("No calendars found");
      return [];
    }

    console.log(
      `Found ${calendarList.length} calendars:`,
      calendarList.map((cal) => ({
        id: cal.id,
        summary: cal.summary,
        primary: cal.primary,
      }))
    );

    // Fetch events from each calendar
    const allEvents: CalendarEvent[] = [];

    for (const cal of calendarList) {
      if (!cal.id) continue;

      console.log(`\nFetching events for calendar: ${cal.summary} (${cal.id})`);

      const response = await calendar.events.list({
        calendarId: cal.id,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = response.data.items || [];

      if (events.length === 0) {
        console.log(`No events found for calendar ${cal.summary}`);
        continue;
      }

      console.log(`Found ${events.length} events for calendar ${cal.summary}`);

      // Log first 5 events details for debugging
      events.slice(0, 5).forEach((event, index) => {
        console.log(`\nEvent ${index + 1}:`, {
          id: event.id,
          summary: event.summary,
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          attendees: event.attendees?.length || 0,
          hasHangoutLink: !!event.hangoutLink,
          hasConferenceData: !!event.conferenceData,
          organizer: event.organizer?.email,
          status: event.status,
        });
      });

      for (const event of events) {
        if (!event.id || !event.summary) continue;

        // Get meeting link
        let meetingLink: string | null = null;
        if (event.hangoutLink) {
          meetingLink = event.hangoutLink;
        } else if (event.conferenceData?.entryPoints) {
          const videoEntry = event.conferenceData.entryPoints.find(
            (entry) => entry.entryPointType === "video"
          );
          if (videoEntry?.uri) {
            meetingLink = videoEntry.uri;
          }
        }

        // Get attendees
        const attendees =
          event.attendees?.map((attendee) => ({
            email: attendee.email || "",
            name: attendee.displayName || undefined,
          })) || [];

        // Check if user is organizer
        const isOrganizer =
          event.organizer?.email ===
          event.attendees?.find((attendee) => attendee.self)?.email;

        // Format dates correctly
        const startTime =
          event.start?.dateTime ||
          (event.start?.date ? `${event.start.date}T00:00:00` : null);
        const endTime =
          event.end?.dateTime ||
          (event.end?.date ? `${event.end.date}T23:59:59` : null);

        if (!startTime || !endTime) continue;

        allEvents.push({
          id: event.id,
          calendar_id: cal.id,
          title: event.summary,
          description: event.description || null,
          start_time: startTime,
          end_time: endTime,
          location: event.location || null,
          meeting_link: meetingLink,
          attendees,
          is_organizer: isOrganizer,
          status:
            (event.status as "confirmed" | "tentative" | "cancelled") ||
            "confirmed",
          html_link: event.htmlLink || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    console.log(
      `\nTotal events found across all calendars: ${allEvents.length}`
    );
    console.log(
      "First 3 processed events:",
      allEvents.slice(0, 3).map((event) => ({
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        attendees: event.attendees.length,
        has_meeting: !!event.meeting_link,
      }))
    );

    return allEvents.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return [];
  }
}

/**
 * Store calendar events in Supabase
 */
export async function storeCalendarEvents(
  userId: string,
  events: CalendarEvent[]
): Promise<boolean> {
  try {
    console.log(`Storing ${events.length} calendar events in Supabase...`);

    if (events.length === 0) {
      console.log("No events to store");
      return true;
    }

    const supabase = createClientClient();

    // Format events for insertion
    const formattedEvents = events.map((event) => ({
      user_id: userId,
      provider: "google",
      external_event_id: event.id,
      calendar_id: event.calendar_id,
      title: event.title,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location,
      meeting_link: event.meeting_link,
      attendees: event.attendees,
      is_organizer: event.is_organizer,
      status: event.status,
      html_link: event.html_link,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    console.log("Upserting events to Supabase...");

    // Upsert events to handle both new and updated events
    const { error } = await supabase
      .from("calendar_events")
      .upsert(formattedEvents, {
        onConflict: "user_id,provider,external_event_id",
      });

    if (error) {
      console.error("Error storing calendar events:", error);
      return false;
    }

    console.log("Events stored successfully");

    // Update last sync timestamp
    console.log("Updating last sync timestamp...");
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        last_calendar_sync: new Date().toISOString(),
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error updating last sync timestamp:", profileError);
    }

    return true;
  } catch (error) {
    console.error("Error storing calendar events:", error);
    return false;
  }
}

/**
 * Sync Google Calendar events to Supabase
 */
export async function syncGoogleCalendarEvents(
  userId: string,
  daysAhead = 30
): Promise<boolean> {
  try {
    console.log(`Starting calendar sync for user ${userId}...`);

    // Get access token
    const accessToken = await getGoogleAccessToken(userId);
    if (!accessToken) {
      console.error("Failed to get access token");
      return false;
    }

    console.log("Successfully got access token");

    // Fetch events from Google Calendar
    const events = await fetchUpcomingGoogleEvents(userId, daysAhead);

    if (events.length === 0) {
      console.log("No events to sync");
      return true;
    }

    console.log(`Found ${events.length} events to sync`);

    // Store events in Supabase
    const success = await storeCalendarEvents(userId, events);

    if (!success) {
      console.error("Failed to store calendar events");
      return false;
    }

    console.log("Successfully synced calendar events");
    return true;
  } catch (error) {
    console.error("Error syncing Google Calendar events:", error);
    return false;
  }
}

/**
 * Check if user has connected their Google Calendar
 */
export async function isGoogleCalendarConnected(
  userId: string
): Promise<boolean> {
  try {
    const supabase = createClientClient();

    const { data, error } = await supabase
      .from("calendar_connections")
      .select("id")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    return !error && !!data;
  } catch (error) {
    console.error("Error checking Google Calendar connection:", error);
    return false;
  }
}

/**
 * Disconnect Google Calendar integration
 */
export async function disconnectGoogleCalendar(
  userId: string
): Promise<boolean> {
  try {
    const supabase = createClientClient();

    // Delete connection record
    const { error } = await supabase
      .from("calendar_connections")
      .delete()
      .eq("user_id", userId)
      .eq("provider", "google");

    if (error) {
      console.error("Error disconnecting Google Calendar:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error disconnecting Google Calendar:", error);
    return false;
  }
}
