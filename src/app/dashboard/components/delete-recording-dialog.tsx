"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

interface DeleteRecordingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRecordingDialog({
  isOpen,
  onClose,
  onConfirm,
}: DeleteRecordingDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    if (confirmText.toLowerCase() === "delete") {
      onConfirm();
      setConfirmText("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Cancel Recording
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The recording will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Type <span className="font-medium text-foreground">delete</span> to
            confirm
          </div>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className="w-full"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Go back
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={confirmText.toLowerCase() !== "delete"}
            >
              Delete Recording
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
