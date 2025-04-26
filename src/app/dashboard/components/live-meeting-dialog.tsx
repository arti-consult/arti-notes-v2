"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LiveRecording } from "./live-recording";
import { useRouter } from "next/navigation";

interface LiveMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveMeetingDialog({ isOpen, onClose }: LiveMeetingDialogProps) {
  const router = useRouter();

  const handleRecordingComplete = (_recordingId: string) => {
    // Refresh the recordings list on the dashboard
    router.refresh();

    // Optionally navigate to the recording detail page
    // router.push(`/dashboard/recordings/${recordingId}`);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <LiveRecording onClose={onClose} onComplete={handleRecordingComplete} />
      </DialogContent>
    </Dialog>
  );
}
