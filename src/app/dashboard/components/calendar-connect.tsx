"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";

export function CalendarConnect() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleConnect = async () => {
    try {
      setIsLoading(true);

      // Get Nylas OAuth URL
      const response = await fetch("/api/auth/nylas");
      const { url } = await response.json();

      // Redirect to Nylas OAuth
      window.location.href = url;
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error);
    } finally {
      setIsLoading(false);
    }
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
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Calendar className="h-5 w-5 text-gray-500" />
            </>
          )}
        </div>
        {isLoading ? "Connecting..." : "Connect Google Calendar"}
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
        onClick={handleMicrosoftConnect}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
        Connect Microsoft Calendar
      </Button>
    </div>
  );
}
