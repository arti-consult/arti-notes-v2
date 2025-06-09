// src/utils/calendar/google-calendar.ts
import { createClient } from "@/utils/supabase/server";
import { google } from "googleapis";

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  conferenceData?: {
    conferenceSolution?: {
      name?: string;
    };
    entryPoints?: Array<{
      entryPointType?: string;
      uri?: string;
    }>;
  };
  organizer?: {
    email: string;
    displayName?: string;
  };
  hangoutLink?: string;
}

export async function getGoogleAuthUrl(): Promise<string> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const scopes = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  return authUrl;
}

export async function handleGoogleCallback(code: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return false;
    }

    // Exchange code for tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      console.error("No access token received");
      return false;
    }

    // Calculate token expiry
    const expiryDate = tokens.expiry_date
      ? new Date(tokens.expiry_date).toISOString()
      : new Date(Date.now() + 3600000).toISOString(); // Default 1 hour

    // Store connection in database
    const { error: connectionError } = await supabase
      .from("calendar_connections")
      .upsert({
        user_id: user.id,
        provider: "google",
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        token_expiry: expiryDate,
        updated_at: new Date().toISOString(),
      });

    if (connectionError) {
      console.error("Error storing calendar connection:", connectionError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error handling Google callback:", error);
    return false;
  }
}

export async function isGoogleCalendarConnected(
  userId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("calendar_connections")
      .select("id")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    return !error && !!data;
  } catch (error) {
    console.error("Error checking calendar connection:", error);
    return false;
  }
}

export async function getValidGoogleTokens(
  userId: string
): Promise<{ accessToken: string; refreshToken?: string } | null> {
  try {
    const supabase = await createClient();

    const { data: connection, error } = await supabase
      .from("calendar_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    if (error || !connection) {
      console.error("No calendar connection found:", error);
      return null;
    }

    // Check if token is expired
    const expiryDate = new Date(connection.token_expiry);
    const now = new Date();

    if (expiryDate <= now && connection.refresh_token) {
      // Token is expired, refresh it
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        refresh_token: connection.refresh_token,
      });

      try {
        const { credentials } = await oauth2Client.refreshAccessToken();

        // Update tokens in database
        const newExpiryDate = credentials.expiry_date
          ? new Date(credentials.expiry_date).toISOString()
          : new Date(Date.now() + 3600000).toISOString();

        await supabase
          .from("calendar_connections")
          .update({
            access_token: credentials.access_token,
            token_expiry: newExpiryDate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", connection.id);

        return {
          accessToken: credentials.access_token!,
          refreshToken: connection.refresh_token,
        };
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return null;
      }
    }

    return {
      accessToken: connection.access_token,
      refreshToken: connection.refresh_token,
    };
  } catch (error) {
    console.error("Error getting valid tokens:", error);
    return null;
  }
}

export async function fetchGoogleCalendarEvents(
  userId: string,
  daysAhead: number = 30
): Promise<GoogleCalendarEvent[]> {
  try {
    const tokens = await getValidGoogleTokens(userId);
    if (!tokens) {
      console.error("No valid tokens available");
      return [];
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Calculate date range
    const timeMin = new Date().toISOString();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + daysAhead);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    });

    return (response.data.items as GoogleCalendarEvent[]) || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return [];
  }
}

export async function syncGoogleCalendarEvents(
  userId: string,
  daysAhead: number = 30
): Promise<boolean> {
  try {
    console.log(`Starting sync for user ${userId}, ${daysAhead} days ahead`);

    const events = await fetchGoogleCalendarEvents(userId, daysAhead);
    console.log(`Fetched ${events.length} events from Google Calendar`);

    if (events.length === 0) {
      console.log("No events to sync");
      return true;
    }

    const supabase = await createClient();

    // Transform and insert events
    const calendarEvents = events.map((event) => {
      // Extract meeting link from various sources
      let meetingLink = event.hangoutLink;
      if (!meetingLink && event.conferenceData?.entryPoints) {
        const videoEntry = event.conferenceData.entryPoints.find(
          (entry) => entry.entryPointType === "video"
        );
        meetingLink = videoEntry?.uri;
      }
      if (!meetingLink && event.description) {
        // Try to extract meeting links from description
        const linkRegex = /(https?:\/\/[^\s]+(?:meet|teams|zoom)[^\s]*)/gi;
        const matches = event.description.match(linkRegex);
        if (matches && matches.length > 0) {
          meetingLink = matches[0];
        }
      }

      // Determine provider based on meeting link
      let provider = "unknown";
      if (meetingLink) {
        if (meetingLink.includes("meet.google.com")) {
          provider = "google";
        } else if (meetingLink.includes("teams.microsoft.com")) {
          provider = "microsoft";
        } else if (meetingLink.includes("zoom.us")) {
          provider = "zoom";
        }
      }

      // Parse attendees
      const attendees =
        event.attendees?.map((attendee) => ({
          email: attendee.email,
          name: attendee.displayName || attendee.email,
          response_status: attendee.responseStatus || "needsAction",
        })) || [];

      // Parse start and end times
      const startTime = event.start?.dateTime || event.start?.date;
      const endTime = event.end?.dateTime || event.end?.date;

      return {
        user_id: userId,
        provider,
        external_event_id: event.id,
        calendar_id: "primary",
        title: event.summary || "Untitled Event",
        description: event.description || null,
        start_time: startTime ? new Date(startTime).toISOString() : null,
        end_time: endTime ? new Date(endTime).toISOString() : null,
        location: event.location || null,
        meeting_link: meetingLink || null,
        attendees: attendees.length > 0 ? attendees : null,
        is_organizer: event.organizer
          ? event.organizer.email ===
            attendees.find((a) => a.response_status === "accepted")?.email
          : false,
        status: "confirmed",
        synced_to_meetings: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    // Insert events, handling conflicts
    const { error: insertError } = await supabase
      .from("calendar_events")
      .upsert(calendarEvents, {
        onConflict: "user_id,external_event_id",
        ignoreDuplicates: false,
      });

    if (insertError) {
      console.error("Error inserting calendar events:", insertError);
      return false;
    }

    // Update last sync time
    await supabase
      .from("profiles")
      .update({
        last_calendar_sync: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    console.log(`Successfully synced ${calendarEvents.length} events`);
    return true;
  } catch (error) {
    console.error("Error syncing Google Calendar events:", error);
    return false;
  }
}

export async function disconnectGoogleCalendar(
  userId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Delete calendar connection
    const { error: connectionError } = await supabase
      .from("calendar_connections")
      .delete()
      .eq("user_id", userId)
      .eq("provider", "google");

    if (connectionError) {
      console.error("Error deleting calendar connection:", connectionError);
      return false;
    }

    // Optionally delete calendar events
    const { error: eventsError } = await supabase
      .from("calendar_events")
      .delete()
      .eq("user_id", userId)
      .eq("provider", "google");

    if (eventsError) {
      console.error("Error deleting calendar events:", eventsError);
      // Don't return false here as connection deletion was successful
    }

    return true;
  } catch (error) {
    console.error("Error disconnecting Google Calendar:", error);
    return false;
  }
}
