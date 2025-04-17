import { getMicrosoftToken } from './microsoftService';

interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  onlineMeeting?: {
    joinUrl: string;
  };
}

export async function getUpcomingMeetings(userId: string): Promise<CalendarEvent[]> {
  try {
    const accessToken = await getMicrosoftToken(userId);
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + 7);

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendarView?` +
      `startDateTime=${now.toISOString()}&` +
      `endDateTime=${endOfWeek.toISOString()}&` +
      `$select=id,subject,start,end,onlineMeeting`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error fetching upcoming meetings:', error);
    return [];
  }
}

export async function getMeetingDetails(userId: string, meetingId: string) {
  try {
    const accessToken = await getMicrosoftToken(userId);
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/events/${meetingId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch meeting details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    return null;
  }
}