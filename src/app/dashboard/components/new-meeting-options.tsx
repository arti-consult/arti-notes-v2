"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { LiveRecordingDialog } from "./live-recording-dialog";
import { MeetingUrlDialog } from "./meeting-url-dialog";

export function NewMeetingOptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Start New Meeting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <LiveRecordingDialog />
          <MeetingUrlDialog />
        </div>
      </CardContent>
    </Card>
  );
}
