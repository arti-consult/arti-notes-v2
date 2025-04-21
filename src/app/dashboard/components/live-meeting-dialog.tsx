"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LiveRecording } from "./live-recording";

interface LiveMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveMeetingDialog({ isOpen, onClose }: LiveMeetingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <LiveRecording onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
