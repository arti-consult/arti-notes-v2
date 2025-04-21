"use client";

import { useState } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isWithinInterval, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

type Participant = {
  name: string;
  avatar?: string;
};

type Meeting = {
  id: string;
  title: string;
  date: Date;
  duration: string;
  meetingType: "teams" | "google-meet";
  participants: Participant[];
};

// Mock data - replace with actual data from your backend
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Ukentlig teamsmøte",
    date: new Date("2024-03-15"),
    duration: "45 min",
    meetingType: "teams" as const,
    participants: [
      { name: "Ola Nordmann", avatar: "/avatars/01.png" },
      { name: "Kari Hansen" },
      { name: "Per Olsen" },
      { name: "Mari Larsen" },
    ],
  },
  {
    id: "2",
    title: "Prosjektgjennomgang",
    date: new Date("2024-03-14"),
    duration: "1t 15min",
    meetingType: "google-meet" as const,
    participants: [
      { name: "Erik Johansen" },
      { name: "Lisa Berg" },
      { name: "Tom Andersen" },
    ],
  },
  {
    id: "3",
    title: "Kundemøte - Innovasjon AS",
    date: new Date("2024-03-13"),
    duration: "30 min",
    meetingType: "teams" as const,
    participants: [
      { name: "Sara Nilsen" },
      { name: "Anders Bakke" },
      { name: "Maria Solberg" },
      { name: "Jonas Larsen" },
    ],
  },
];

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [meetingTypeFilter, setMeetingTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredMeetings = mockMeetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.participants.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDate =
      !dateRange?.from ||
      !dateRange?.to ||
      isWithinInterval(meeting.date, {
        start: dateRange.from,
        end: dateRange.to,
      });

    const matchesType =
      meetingTypeFilter === "all" || meeting.meetingType === meetingTypeFilter;

    return matchesSearch && matchesDate && matchesType;
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
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
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dato</label>
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Møtetype</label>
                    <Select
                      value={meetingTypeFilter}
                      onValueChange={setMeetingTypeFilter}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Velg møtetype" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle typer</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                        <SelectItem value="google-meet">Google Meet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredMeetings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Ingen møter funnet</p>
            </CardContent>
          </Card>
        ) : (
          filteredMeetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{meeting.title}</h3>
                      {meeting.meetingType === "teams" ? (
                        <img
                          src="/teams-icon.png"
                          alt="Teams"
                          className="h-5 w-5"
                        />
                      ) : (
                        <img
                          src="/google-meet-icon.png"
                          alt="Google Meet"
                          className="h-5 w-5"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {format(meeting.date, "d. MMMM yyyy", { locale: nb })}
                        </span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span>{meeting.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {meeting.participants.map((participant, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1.5 px-2.5 py-1"
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      title="Se notater"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      title="Last ned"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
