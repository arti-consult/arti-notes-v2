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
  const [showLiveMeeting, setShowLiveMeeting] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
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
    // TODO: Implement file upload logic
    console.log("Uploading file:", file.name);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto text-gray-700 transition-colors duration-300">
        <div className="w-full h-full">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center px-4">
              <div className="flex-1" />
              <div className="flex items-center justify-center flex-1">
                <SearchDialog />
              </div>
              <div className="flex items-center justify-end gap-4 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span>100 kreditter igjen</span>
                </div>
                <PurchaseCreditsDialog />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:bg-gray-100"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="@user" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white border-gray-200"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-700">
                          User Name
                        </p>
                        <p className="text-xs leading-none text-gray-500">
                          user@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem className="hover:bg-gray-100 text-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-100 text-gray-700">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Innstillinger</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="hover:bg-gray-100 text-gray-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logg ut</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="py-4 px-[50px] max-w-[1200px] mx-auto">
            <div className="flex gap-4 w-full">
              {/* Main Column - Meetings */}
              <div className="flex flex-col gap-4 w-full">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      <div className="flex flex-col items-center gap-4">
                        <NewMeetingArea onFileUpload={handleFileUpload} />
                      </div>
                      <div className="space-y-3">
                        {isLoading ? (
                          <div className="text-center text-gray-500">
                            Loading meetings...
                          </div>
                        ) : (
                          <MeetingList meetings={meetings} showEmpty={false} />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center mt-8">
                      <Link href="/dashboard/meetings">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 cursor-pointer hover:text-[#145DFC]"
                        >
                          <List className="h-4 w-4" />
                          Se alle møter
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Controls and Settings */}
              <div className="flex flex-col gap-4 flex-1">
                {/* Live Meeting Button */}
                <Card className="bg-white border-gray-200">
                  <CardContent className="pt-6">
                    <Button
                      className="w-full bg-violet-600 hover:bg-violet-700 gap-2 text-white"
                      size="lg"
                      onClick={() => setShowLiveMeeting(true)}
                    >
                      <Mic className="h-5 w-5" />
                      Start live møte
                    </Button>
                  </CardContent>
                </Card>

                {/* Note Taking Settings */}
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-700">
                      <Settings2 className="h-5 w-5" />
                      Innstillinger for notatskriving
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Språk
                      </label>
                      <Select defaultValue="no">
                        <SelectTrigger className="bg-white border-gray-200 text-gray-700">
                          <SelectValue placeholder="Velg språk" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem
                            value="no"
                            className="text-gray-700 hover:bg-gray-50"
                          >
                            Norsk
                          </SelectItem>
                          <SelectItem
                            value="en"
                            className="text-gray-700 hover:bg-gray-50"
                          >
                            Engelsk
                          </SelectItem>
                          <SelectItem
                            value="sv"
                            className="text-gray-700 hover:bg-gray-50"
                          >
                            Svensk
                          </SelectItem>
                          <SelectItem
                            value="da"
                            className="text-gray-700 hover:bg-gray-50"
                          >
                            Dansk
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Notatstil
                      </label>
                      <Select defaultValue="detailed">
                        <SelectTrigger className="bg-white border-gray-200 text-gray-700">
                          <SelectValue placeholder="Velg notatstil" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem
                            value="detailed"
                            className="text-gray-700 hover:bg-gray-50"
                          >
                            Detaljert
                          </SelectItem>
                          <SelectItem
                            value="summary"
                            className="text-gray-700 hover:bg-gray-50"
                          >
                            Sammendrag
                          </SelectItem>
                          <SelectItem
                            value="bullet"
                            className="text-gray-700 hover:bg-gray-50"
                          >
                            Punktliste
                          </SelectItem>
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
      </main>
    </div>
  );
}
