// src/utils/calendar/calendar-events-service.ts
import { createClient } from '@/utils/supabase/client';

export interface CalendarEvent {
  id: string;
  user_id: string;
  provider: string;
  external_event_id: string;
  calendar_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  meeting_link: string | null;
  attendees: { email: string; name?: string }[];
  is_organizer: boolean;
  status: 'confirmed' | 'tentative' | 'cancelled';
  html_link: string;
  synced_to_meeting: boolean;
  meeting_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get upcoming calendar events with meeting links
 */
export async function getUpcomingCalendarEventsWithMeetingLinks(daysAhead: number = 7): Promise<CalendarEvent[]> {
  try {
    const supabase = createClient();
    
    // Get upcoming events with meeting links
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .not('meeting_link', 'is', null)
      .gte('start_time', new Date().toISOString())
      .lte('start_time', new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString())
      .order('start_time', { ascending: true });
      
    if (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

/**
 * Determine the meeting type from a meeting link
 */
export function determineMeetingType(meetingLink: string): 'google-meets' | 'microsoft-teams' | 'live' {
  const lowerCaseLink = meetingLink.toLowerCase();
  
  if (lowerCaseLink.includes('meet.google.com')) {
    return 'google-meets';
  } else if (lowerCaseLink.includes('teams.microsoft.com')) {
    return 'microsoft-teams';
  } else {
    return 'live';
  }
}

/**
 * Create meetings from calendar events that have meeting links
 */
export async function createMeetingsFromCalendarEvents(): Promise<number> {
  try {
    const supabase = createClient();
    
    // Get upcoming events with meeting links that haven't been synced
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select('*')
      .not('meeting_link', 'is', null)
      .eq('synced_to_meeting', false)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });
      
    if (error) {
      console.error('Error fetching calendar events:', error);
      return 0;
    }
    
    if (!events || events.length === 0) {
      return 0;
    }
    
    let syncedCount = 0;
    
    // Process each event
    for (const event of events) {
      if (!event.meeting_link) continue;
      
      // Determine meeting type
      const meetingType = determineMeetingType(event.meeting_link);
      
      // Create meeting
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .insert({
          title: event.title,
          description: event.description,
          user_id: event.user_id,
          meeting_type: meetingType,
          start_time: event.start_time,
          end_time: event.end_time,
          calendar_event_id: event.id,
          meeting_url: event.meeting_link,
          attendees: event.attendees,
          location: event.location,
          status: 'scheduled',
          transcription_status: 'pending',
          summary_status: 'pending'
        })
        .select('id')
        .single();
        
      if (meetingError) {
        console.error('Error creating meeting from calendar event:', meetingError);
        continue;
      }
      
      // Update calendar event with meeting ID
      const { error: updateError } = await supabase
        .from('calendar_events')
        .update({
          synced_to_meeting: true,
          meeting_id: meeting.id
        })
        .eq('id', event.id);
        
      if (updateError) {
        console.error('Error updating calendar event:', updateError);
        continue;
      }
      
      syncedCount++;
    }
    
    return syncedCount;
  } catch (error) {
    console.error('Error creating meetings from calendar events:', error);
    return 0;
  }
}

/**
 * Get calendar events that have been synced to meetings
 */
export async function getSyncedCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const supabase = createClient();
    
    // Get events that have been synced to meetings
    const { data, error } = await supabase
      .from('calendar_events')
      .select(`
        *,
        meetings:meeting_id (
          id,
          title,
          start_time,
          end_time,
          meeting_type,
          transcription_status,
          summary_status
        )
      `)
      .eq('synced_to_meeting', true)
      .order('start_time', { ascending: false });
      
    if (error) {
      console.error('Error fetching synced events:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching synced events:', error);
    return [];
  }
}

/**
 * Update meetings if calendar events change
 */
export async function updateMeetingsFromCalendarEvents(): Promise<number> {
  try {
    const supabase = createClient();
    
    // Get synced events
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select(`
        *,
        meetings:meeting_id (
          id,
          title,
          start_time,
          end_time
        )
      `)
      .eq('synced_to_meeting', true)
      .not('meeting_id', 'is', null);
      
    if (error) {
      console.error('Error fetching synced events:', error);
      return 0;
    }
    
    if (!events || events.length === 0) {
      return 0;
    }
    
    let updatedCount = 0;
    
    // Process each event
    for (const event of events) {
      if (!event.meeting_id || !event.meetings) continue;
      
      const meeting = event.meetings as any;
      
      // Check if meeting needs updating
      if (
        meeting.title !== event.title ||
        meeting.start_time !== event.start_time ||
        meeting.end_time !== event.end_time
      ) {
        // Update meeting
        const { error: updateError } = await supabase
          .from('meetings')
          .update({
            title: event.title,
            start_time: event.start_time,
            end_time: event.end_time,
            updated_at: new Date().toISOString()
          })
          .eq('id', event.meeting_id);
          
        if (updateError) {
          console.error('Error updating meeting:', updateError);
          continue;
        }
        
        updatedCount++;
      }
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Error updating meetings from calendar events:', error);
    return 0;
  }
}