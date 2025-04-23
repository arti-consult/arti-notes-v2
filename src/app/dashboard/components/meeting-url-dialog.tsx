"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MeetingUrlDialogProps {
  onClose: () => void;
}

interface MeetingData {
  title: string;
  url: string;
  language: string;
  meeting_type: 'google-meets' | 'microsoft-teams';
}

export function MeetingUrlDialog({ onClose }: MeetingUrlDialogProps) {
  const [formData, setFormData] = useState<MeetingData>({
    title: "",
    url: "",
    language: "no", // Default to Norwegian
    meeting_type: "microsoft-teams", // Default to Teams
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle meeting data submission
    console.log("Meeting data:", formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Meeting URL</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              placeholder="Enter meeting title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting_type">Meeting Type</Label>
            <Select
              value={formData.meeting_type}
              onValueChange={(value: 'google-meets' | 'microsoft-teams') =>
                setFormData({ ...formData, meeting_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                <SelectItem value="google-meets">Google Meet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Meeting URL</Label>
            <Input
              id="url"
              placeholder={formData.meeting_type === 'microsoft-teams' ? 
                "https://teams.microsoft.com/..." : 
                "https://meet.google.com/..."
              }
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) =>
                setFormData({ ...formData, language: value })
              }
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">Norsk</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Start Recording</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
