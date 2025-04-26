"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { MeetingList, Meeting } from "@/app/dashboard/components/meeting-list";
import { createClient } from "@/utils/supabase/client";

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [meetingTypeFilter, setMeetingTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("User not authenticated");
        }

        const { data, error } = await supabase
          .from("meetings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match the Meeting type
        const transformedMeetings: Meeting[] = (data || []).map((meeting) => {
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
        });

        setMeetings(transformedMeetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.participants.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDate =
      !dateRange?.from ||
      !dateRange?.to ||
      (meeting.startTime >= dateRange.from && meeting.endTime <= dateRange.to);

    const matchesType =
      meetingTypeFilter === "all" || meeting.meeting_type === meetingTypeFilter;

    return matchesSearch && matchesDate && matchesType;
  });

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Alle møter</h1>
            <p className="text-sm text-muted-foreground">
              Oversikt over alle dine møter og opptak
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setDateRange(undefined);
                setMeetingTypeFilter("all");
                setShowFilters(false);
              }}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Vis alle møter
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Skjul filtre" : "Vis filtre"}
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Link href="/dashboard/meeting/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nytt møte
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søk etter møter eller deltakere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {showFilters && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label>Møtetype</Label>
                <Select
                  value={meetingTypeFilter}
                  onValueChange={setMeetingTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Velg type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle typer</SelectItem>
                    <SelectItem value="live">Live opptak</SelectItem>
                    <SelectItem value="microsoft-teams">
                      Microsoft Teams
                    </SelectItem>
                    <SelectItem value="google-meets">Google Meet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Datointervall</Label>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Laster møter...
          </div>
        ) : (
          <div className="space-y-4">
            <MeetingList meetings={filteredMeetings} />
          </div>
        )}
      </div>
    </div>
  );
}
