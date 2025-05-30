"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarConnect } from "./calendar-connect";
import { createClient } from "@/utils/supabase/client";

interface Attendee {
  email: string;
  name?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  attendees: Attendee[];
}

interface Props {
  daysAhead?: number;
}

export function UpcomingMeetings({ daysAhead = 7 }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkCalendarConnection = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsConnected(false);
        return false;
      }

      // Check for calendar connection
      const { data, error } = await supabase
        .from("calendar_connections")
        .select("id")
        .eq("user_id", user.id)
        .eq("provider", "google")
        .single();

      setIsConnected(!!data && !error);
      return !!data && !error;
    } catch (error) {
      console.error("Error checking calendar connection:", error);
      setIsConnected(false);
      return false;
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      console.log("Fetching calendar events...");

      // Calculate date range
      const now = new Date();
      const future = new Date();
      future.setDate(future.getDate() + daysAhead);

      // Fetch calendar events
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_time", now.toISOString())
        .lte("start_time", future.toISOString())
        .order("start_time", { ascending: true });

      if (error) {
        throw error;
      }

      console.log(`Found ${data?.length || 0} calendar events`);
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      console.log("Failed to load upcoming meetings");
    } finally {
      setIsLoading(false);
    }
  };

  const syncCalendar = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch("/api/calendar/google/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ daysAhead }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync calendar");
      }

      await fetchEvents();
      console.log("Success: Calendar synced successfully");
    } catch (error) {
      console.error("Error syncing calendar:", error);
      console.log("Failed to sync calendar");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const isConnected = await checkCalendarConnection();
      if (isConnected) {
        fetchEvents();
      } else {
        setIsLoading(false);
      }
    };

    init();

    // Listen for URL changes to detect successful connection
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("success");
      const error = urlParams.get("error");

      if (success) {
        console.log("Success message detected:", success);
        console.log("Success:", success);

        // Remove parameters from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("success");
        window.history.replaceState({}, document.title, newUrl);

        // Refresh events after successful connection
        init();
      }

      if (error) {
        console.log("Error message detected:", error);
        console.log("Error:", error);

        // Remove parameters from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("error");
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [daysAhead]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("no-NO", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const hours = Math.round(
      (endTime.getTime() - startTime.getTime()) / 3600000
    );
    return `${hours}h`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kommende møter
          </div>
          {events.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={syncCalendar}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Oppdater</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : isConnected ? (
          events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="space-y-2">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.start_time)}</span>
                      <span className="ml-2">
                        {formatDuration(event.start_time, event.end_time)}
                      </span>
                    </div>
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {event.attendees.map((attendee, index) => (
                          <div
                            key={index}
                            className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                          >
                            {attendee.name || attendee.email}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No upcoming meetings found
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Connect your calendar to see upcoming meetings
            </div>
            <CalendarConnect />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
