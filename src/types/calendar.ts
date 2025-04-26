export interface CalendarEvent {
  id: string;
  calendar_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  meeting_link: string | null;
  attendees: { email: string; name?: string }[];
  is_organizer: boolean;
  status: "confirmed" | "tentative" | "cancelled";
  html_link: string;
  created_at: string;
  updated_at: string;
}
