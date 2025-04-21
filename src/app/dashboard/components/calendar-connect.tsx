"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function CalendarConnect() {
  const handleGoogleConnect = async () => {
    // TODO: Implement Google Calendar OAuth
    console.log("Connecting to Google Calendar");
  };

  const handleMicrosoftConnect = async () => {
    // TODO: Implement Microsoft Calendar OAuth
    console.log("Connecting to Microsoft Calendar");
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
        onClick={handleGoogleConnect}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <img
            src="/google-calendar-icon.svg"
            alt="Google Calendar"
            className="h-5 w-5"
          />
        </div>
        Connect Google Calendar
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
        onClick={handleMicrosoftConnect}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <img
            src="/microsoft-calendar-icon.svg"
            alt="Microsoft Calendar"
            className="h-5 w-5"
          />
        </div>
        Connect Microsoft Calendar
      </Button>
    </div>
  );
}
