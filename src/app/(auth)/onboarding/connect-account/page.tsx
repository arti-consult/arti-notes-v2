"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConnectAccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/nylas");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect account");
      }

      // Redirect to Nylas OAuth page
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Calendar</CardTitle>
          <CardDescription>
            Connect your calendar to start managing your schedule with Arti
            Notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Connecting..." : "Connect Calendar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
