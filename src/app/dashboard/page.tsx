"use client";

import { useState } from "react";
import {
  User,
  Sparkles,
  Users,
  Settings,
  Plus,
  Calendar,
  Mic,
  Settings2,
  Clock,
  MoreVertical,
  FileText,
  Download,
  Bot,
  List,
  CreditCard,
  LogOut,
} from "lucide-react";
import { SearchDialog } from "./components/search-dialog";
import { PurchaseCreditsDialog } from "./components/purchase-credits-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { UploadArea } from "./components/upload-area";
import { NewMeetingArea } from "./components/new-meeting-area";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LiveRecording } from "./components/live-recording";
import { NewMeetingDropdown } from "./components/new-meeting-dropdown";
import { CalendarConnect } from "./components/calendar-connect";
import { LiveMeetingDialog } from "./components/live-meeting-dialog";

function MeetingCard({
  id,
  title,
  date,
  duration,
  participants,
  meetingType,
}: {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: { name: string; avatar?: string }[];
  meetingType: "teams" | "google-meet";
}) {
  return (
    <Link href={`/dashboard/meeting/${id}`}>
      <div className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer mb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{title}</h3>
              {meetingType === "teams" ? (
                <img src="/teams-icon.png" alt="Teams" className="h-4 w-4" />
              ) : (
                <img
                  src="/google-meet-icon.png"
                  alt="Google Meet"
                  className="h-4 w-4"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{duration}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {participants.map((participant, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1.5 px-2 py-1"
                  >
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="h-4 w-4 rounded-full"
                      />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                        {participant.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs">{participant.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Se notater"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="AI-analyse"
            >
              <Bot className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Last ned"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [showLiveMeeting, setShowLiveMeeting] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
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

  const handleNewMeeting = () => {
    // TODO: Implement new meeting logic
    console.log("Starting new meeting");
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
                  <MeetingCard
                    id="1"
                    title="Ukentlig teamsmøte"
                    date="15. mars 2024"
                    duration="45 min"
                    meetingType="teams"
                    participants={[
                      { name: "Ola Nordmann", avatar: "/avatars/01.png" },
                      { name: "Kari Hansen" },
                      { name: "Per Olsen" },
                      { name: "Mari Larsen" },
                    ]}
                  />
                  <MeetingCard
                    id="2"
                    title="Prosjektgjennomgang"
                    date="14. mars 2024"
                    duration="1t 15min"
                    meetingType="google-meet"
                    participants={[
                      { name: "Erik Johansen" },
                      { name: "Lisa Berg" },
                      { name: "Tom Andersen" },
                    ]}
                  />
                  <MeetingCard
                    id="3"
                    title="Kundemøte - Innovasjon AS"
                    date="13. mars 2024"
                    duration="30 min"
                    meetingType="teams"
                    participants={[
                      { name: "Sara Nilsen" },
                      { name: "Anders Bakke" },
                      { name: "Maria Solberg" },
                      { name: "Jonas Larsen" },
                    ]}
                  />
                  <MeetingCard
                    id="4"
                    title="Strategimøte Q2"
                    date="12. mars 2024"
                    duration="2t"
                    meetingType="teams"
                    participants={[
                      { name: "Lars Johansen", avatar: "/avatars/04.png" },
                      { name: "Ingrid Berg" },
                      { name: "Morten Solberg" },
                      { name: "Eva Larsen" },
                      { name: "Thomas Olsen" },
                    ]}
                  />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Kommende møter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Connect your calendar to see upcoming meetings
                  </div>
                  <CalendarConnect />
                </div>
              </CardContent>
            </Card>
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
