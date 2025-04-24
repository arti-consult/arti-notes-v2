import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@/utils/supabase/client';
import { getGoogleAccessToken } from '@/utils/calendar/auth';

// Number of days to sync in the future
const DAYS_TO_SYNC = 30;

export async function syncGoogleCalendarEvents(userId: string): Promise<boolean> {
  try {
    console.log(`Starting Google Calendar events sync for user ${userId}...`);
    const supabase = await createClient();

    // Get user's calendar connection
    const { data: connection, error: connectionError } = await supabase
      .from('calendar_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single();

    if (connectionError || !connection) {
      console.error('Failed to get calendar connection:', connectionError);
      return false;
    }

    console.log('Retrieved calendar connection, fetching access token...');

    // Get fresh access token
    const accessToken = await getGoogleAccessToken(userId);
    if (!accessToken) {
      console.error('Failed to get access token');
      return false;
    }

    console.log('Got access token, fetching calendar events...');

    // Calculate date range
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + DAYS_TO_SYNC);

    // Initialize Google Calendar API with proper auth
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    console.log(`Fetching events from ${now.toISOString()} to ${futureDate.toISOString()}`);

    // Fetch events from Google Calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: futureDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`Fetched ${events.length} events from Google Calendar`);

    // Process each event
    let processedCount = 0;
    for (const event of events) {
      try {
        const { error: upsertError } = await supabase.from('calendar_events').upsert({
          user_id: userId,
          event_id: event.id,
          calendar_id: 'primary',
          summary: event.summary,
          description: event.description,
          start_time: event.start?.dateTime || event.start?.date,
          end_time: event.end?.dateTime || event.end?.date,
          location: event.location,
          meeting_link: event.hangoutLink,
          last_synced: new Date().toISOString(),
          raw_event: event,
        });

        if (upsertError) {
          console.error(`Failed to upsert event ${event.id}:`, upsertError);
        } else {
          processedCount++;
        }
      } catch (error) {
        console.error(`Error processing event ${event.id}:`, error);
      }
    }

    console.log(`Successfully processed ${processedCount} out of ${events.length} events`);

    // Clean up old events
    const { error: deleteError } = await supabase
      .from('calendar_events')
      .delete()
      .eq('user_id', userId)
      .lt('end_time', now.toISOString());

    if (deleteError) {
      console.error('Failed to clean up old events:', deleteError);
    }

    return true;
  } catch (error) {
    console.error('Error in Google Calendar sync:', error);
    return false;
  }
} 