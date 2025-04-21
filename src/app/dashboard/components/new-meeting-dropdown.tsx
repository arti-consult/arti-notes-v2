"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Mic, Video } from "lucide-react";
import { LiveRecordingDialog } from "./live-recording-dialog";
import { MeetingUrlDialog } from "./meeting-url-dialog";

export function NewMeetingDropdown() {
  const [showRecordingDialog, setShowRecordingDialog] = useState(false);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Start nytt møte
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => setShowRecordingDialog(true)}
            className="cursor-pointer"
          >
            <Mic className="mr-2 h-4 w-4" />
            <span>Start Recording</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowMeetingDialog(true)}
            className="cursor-pointer"
          >
            <Video className="mr-2 h-4 w-4" />
            <span>Add to Meeting</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showRecordingDialog && (
        <LiveRecordingDialog onClose={() => setShowRecordingDialog(false)} />
      )}
      {showMeetingDialog && (
        <MeetingUrlDialog onClose={() => setShowMeetingDialog(false)} />
      )}
    </>
  );
}
