"use client";

import { Mic, Calendar as CalendarIcon, FileText, Download } from "lucide-react";
import { SiGooglemeet } from "react-icons/si";
import { PiMicrosoftTeamsLogoFill } from "react-icons/pi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";

export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  meeting_type: "live" | "google-meets" | "microsoft-teams";
  transcription_status: "pending" | "processing" | "completed" | "failed";
  summary_status: "pending" | "processing" | "completed" | "failed";
  participants: Array<{
    name: string;
    email?: string;
    avatar?: string;
  }>;
  meeting_link?: string;
}

interface MeetingListProps {
  meetings: Meeting[];
  showEmpty?: boolean;
}

export function getMeetingTypeIcon(type: Meeting['meeting_type']) {
  switch (type) {
    case 'microsoft-teams':
      return <PiMicrosoftTeamsLogoFill className="h-5 w-5 text-[#464EB8]" />;
    case 'google-meets':
      return <SiGooglemeet className="h-5 w-5 text-[#00AC47]" />;
    case 'live':
      return <Mic className="h-5 w-5 text-violet-600" />;
  }
}

export function getMeetingTypeLabel(type: Meeting['meeting_type']) {
  switch (type) {
    case 'microsoft-teams':
      return 'Microsoft Teams';
    case 'google-meets':
      return 'Google Meet';
    case 'live':
      return 'Live Recording';
  }
}

function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const parsedDate = date instanceof Date ? date : new Date(date);
  if (!isValidDate(parsedDate)) return 'N/A';
  return format(parsedDate, "d. MMMM yyyy", { locale: nb });
}

function formatTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const parsedDate = date instanceof Date ? date : new Date(date);
  if (!isValidDate(parsedDate)) return 'N/A';
  return format(parsedDate, "HH:mm", { locale: nb });
}

function calculateDuration(startTime: Date | string | null | undefined, endTime: Date | string | null | undefined): string {
  if (!startTime || !endTime) return 'N/A';
  
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const end = endTime instanceof Date ? endTime : new Date(endTime);
  
  if (!isValidDate(start) || !isValidDate(end)) return 'N/A';
  
  const diffInMinutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60)));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  
  if (hours > 0) {
    return `${hours}t ${minutes}m`;
  }
  return `${minutes}m`;
}

function getStatusBadge(status: Meeting['transcription_status'] | Meeting['summary_status']) {
  switch (status) {
    case 'completed':
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">Fullført</Badge>;
    case 'processing':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Behandler</Badge>;
    case 'failed':
      return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Feilet</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Venter</Badge>;
  }
}

function getOverallStatus(meeting: Meeting): Meeting['transcription_status'] {
  if (meeting.transcription_status === 'failed' || meeting.summary_status === 'failed') {
    return 'failed';
  }
  if (meeting.transcription_status === 'processing' || meeting.summary_status === 'processing') {
    return 'processing';
  }
  if (meeting.transcription_status === 'completed' && meeting.summary_status === 'completed') {
    return 'completed';
  }
  return 'pending';
}

export function MeetingList({ meetings, showEmpty = true }: MeetingListProps) {
  if (meetings.length === 0 && showEmpty) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Ingen møter funnet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {meetings.map((meeting) => (
        <Link 
          key={meeting.id} 
          href={`/dashboard/meeting/${meeting.id}`}
          className="block"
        >
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{meeting.title}</h3>
                    {getMeetingTypeIcon(meeting.meeting_type)}
                    <Badge variant="secondary">
                      {getMeetingTypeLabel(meeting.meeting_type)}
                    </Badge>
                    {getStatusBadge(getOverallStatus(meeting))}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {formatDate(meeting.startTime)}
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                    <span className="text-gray-300">•</span>
                    <span>{calculateDuration(meeting.startTime, meeting.endTime)}</span>
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
        </Link>
      ))}
    </div>
  );
} 