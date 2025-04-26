"use client";

import { useState, useEffect } from "react";
import {
  User,
  Settings,
  Mic,
  Settings2,
  List,
  CreditCard,
  LogOut,
} from "lucide-react";
import { SearchDialog } from "./components/search-dialog";
import { PurchaseCreditsDialog } from "./components/purchase-credits-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { NewMeetingArea } from "./components/new-meeting-area";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LiveMeetingDialog } from "./components/live-meeting-dialog";
import { MeetingList, Meeting } from "./components/meeting-list";
import { UpcomingMeetings } from "./components/upcoming-meetings";

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [showLiveMeeting, setShowLiveMeeting] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from("meetings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (meetingsError) {
        throw meetingsError;
      }

      // Transform meetings data
      const transformedMeetings: Meeting[] = (meetingsData || []).map(
        (meeting) => {
          const startTime = meeting.start_time
            ? new Date(meeting.start_time)
            : new Date(meeting.created_at);
          const endTime = meeting.end_time
            ? new Date(meeting.end_time)
            : new Date(startTime.getTime() + 3600000);

          return {
            id: meeting.id,
            title: meeting.title,
            startTime,
            endTime,
            meeting_type: meeting.meeting_type,
            transcription_status: meeting.transcription_status || "pending",
            summary_status: meeting.summary_status || "pending",
            participants: [
              { name: "Ola Nordmann", avatar: "/avatars/01.png" },
              { name: "Kari Hansen" },
            ],
          };
        }
      );

      setMeetings(transformedMeetings);

      // Fetch calendar events with meeting links
      const { data: calendarEventsData, error: calendarError } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .not("meeting_link", "is", null)
        .gte("start_time", new Date().toISOString())
        .lte(
          "start_time",
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        ) // Next 30 days
        .order("start_time", { ascending: true });

      if (calendarError) {
        throw calendarError;
      }

      // Transform calendar events data
      const transformedCalendarEvents: Meeting[] = (
        calendarEventsData || []
      ).map((event) => ({
        id: event.id,
        title: event.title,
        startTime: new Date(event.start_time),
        endTime: new Date(event.end_time),
        meeting_type: "google-meets",
        transcription_status: "pending",
        summary_status: "pending",
        participants:
          event.attendees?.map(
            (attendee: { name?: string; email: string }) => ({
              name: attendee.name || attendee.email,
              email: attendee.email,
            })
          ) || [],
        meeting_link: event.meeting_link,
      }));

      setCalendarEvents(transformedCalendarEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    // TODO: Implement file upload logic
    console.log("Uploading file:", file.name);
    // Simulate upload completion
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="w-full h-full">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex-1" />
          <div className="flex items-center justify-center flex-1">
            <SearchDialog />
          </div>
          <div className="flex items-center justify-end gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="h-4 w-4" />
              <span>100 kreditter igjen</span>
            </div>
            <PurchaseCreditsDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      User Name
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Innstillinger</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logg ut</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-[1fr,350px] gap-4">
          {/* Main Column - Meetings */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <NewMeetingArea onFileUpload={handleFileUpload} />
                </div>
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground">
                      Loading meetings...
                    </div>
                  ) : (
                    <MeetingList meetings={meetings} showEmpty={false} />
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Link href="/dashboard/meetings">
                  <Button variant="outline" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Se alle møter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Controls and Upcoming Meetings */}
          <div className="space-y-4">
            {/* Live Meeting Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 gap-2"
                  size="lg"
                  onClick={() => setShowLiveMeeting(true)}
                >
                  <Mic className="h-5 w-5" />
                  Start live møte
                </Button>
              </CardContent>
            </Card>

            {/* Note Taking Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings2 className="h-5 w-5" />
                  Innstillinger for notatskriving
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Språk</label>
                  <Select defaultValue="no">
                    <SelectTrigger>
                      <SelectValue placeholder="Velg språk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Norsk</SelectItem>
                      <SelectItem value="en">Engelsk</SelectItem>
                      <SelectItem value="sv">Svensk</SelectItem>
                      <SelectItem value="da">Dansk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notatstil</label>
                  <Select defaultValue="detailed">
                    <SelectTrigger>
                      <SelectValue placeholder="Velg notatstil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detailed">Detaljert</SelectItem>
                      <SelectItem value="summary">Sammendrag</SelectItem>
                      <SelectItem value="bullet">Punktliste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <UpcomingMeetings daysAhead={7} />
          </div>
        </div>
      </div>

      <LiveMeetingDialog
        isOpen={showLiveMeeting}
        onClose={() => setShowLiveMeeting(false)}
      />
    </div>
  );
}
