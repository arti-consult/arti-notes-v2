"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { LiveRecording } from "./live-recording";
import { X } from "lucide-react";

interface LiveRecordingDialogProps {
  onClose: () => void;
}

export function LiveRecordingDialog({ onClose }: LiveRecordingDialogProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  const handleRecordingStateChange = (recording: boolean) => {
    setIsRecording(recording);
    if (!recording) {
      setHasRecording(true);
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open && !isRecording && !hasRecording) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Live Recording</DialogTitle>
          <DialogDescription>
            Record audio directly from your microphone. You can start, stop, and
            save your recording.
          </DialogDescription>
          {!isRecording && !hasRecording && (
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}
        </DialogHeader>
        <LiveRecording
          onClose={onClose}
          onRecordingStateChange={handleRecordingStateChange}
        />
      </DialogContent>
    </Dialog>
  );
}
