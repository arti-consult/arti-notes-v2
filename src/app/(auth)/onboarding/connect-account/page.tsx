"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

// Calendar Connection Component
function CalendarConnectionButton({
  isConnected,
  onConnectionChange,
}: {
  isConnected: boolean;
  onConnectionChange?: (connected: boolean) => void;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connected" | "error"
  >(isConnected ? "connected" : "idle");

  useEffect(() => {
    if (isConnected) {
      setConnectionStatus("connected");
    }
  }, [isConnected]);

  const handleConnectCalendar = async () => {
    try {
      setIsConnecting(true);

      // Call the Nylas auth endpoint
      const response = await fetch("/api/auth/nylas", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to get calendar auth URL");
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Nylas OAuth
        window.location.href = url;
      } else {
        throw new Error("No auth URL received");
      }
    } catch (error) {
      console.error("Error connecting calendar:", error);
      setConnectionStatus("error");
      setIsConnecting(false);
    }
  };

  if (connectionStatus === "connected") {
    return (
      <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-800">
            Calendar Connected Successfully!
          </p>
          <p className="text-xs text-green-600">
            Your calendar is now integrated and ready to use
          </p>
        </div>
      </div>
    );
  }

  if (connectionStatus === "error") {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-red-800">
              Connection Failed
            </p>
            <p className="text-xs text-red-600">
              Unable to connect your calendar. Please try again.
            </p>
          </div>
        </div>
        <Button
          onClick={handleConnectCalendar}
          disabled={isConnecting}
          className="w-full"
          variant="outline"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnectCalendar}
      disabled={isConnecting}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Connecting to Google Calendar...
        </>
      ) : (
        <>
          <Calendar className="mr-2 h-5 w-5" />
          Connect Google Calendar
        </>
      )}
    </Button>
  );
}

export default function ConnectAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if calendar was just connected
  useEffect(() => {
    const calendarParam = searchParams.get("calendar");
    const grantIdParam = searchParams.get("grant_id");

    if (calendarParam === "connected") {
      setCalendarConnected(true);

      // If we have a grant ID, try to update the profile
      if (grantIdParam && user) {
        updateProfileWithGrantId(grantIdParam);
      }

      // Remove the parameters from URL without page reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("calendar");
      newUrl.searchParams.delete("grant_id");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, user]);

  const updateProfileWithGrantId = async (grantId: string) => {
    try {
      console.log("Manually updating profile with grant ID:", grantId);

      const response = await fetch("/api/debug/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grantId }),
      });

      const result = await response.json();
      console.log("Profile update result:", result);

      if (result.success) {
        console.log("✅ Profile updated successfully with grant ID");
      } else {
        console.error("❌ Failed to update profile:", result);
      }
    } catch (error) {
      console.error("Exception updating profile:", error);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!calendarConnected) {
      setError("Please connect your calendar to complete setup");
      return;
    }

    if (!user) {
      setError("Authentication required");
      return;
    }

    try {
      setIsCompleting(true);
      setError(null);

      console.log("🔄 Finalizing onboarding...");

      // Import the finalize action
      const { finalizeOnboarding } = await import(
        "@/app/(auth)/onboarding/actions"
      );

      const result = await finalizeOnboarding(user.id);

      if (result?.error) {
        setError(result.error);
        return;
      }

      console.log("✅ Onboarding finalized, redirecting to dashboard");
      // The finalizeOnboarding action will handle the redirect
    } catch (error) {
      console.error("Error finalizing onboarding:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkipCalendar = async () => {
    if (!user) {
      setError("Authentication required");
      return;
    }

    try {
      setIsCompleting(true);
      setError(null);

      console.log("🔄 Completing onboarding without calendar...");

      // Import the finalize action
      const { finalizeOnboarding } = await import(
        "@/app/(auth)/onboarding/actions"
      );

      const result = await finalizeOnboarding(user.id);

      if (result?.error) {
        setError(result.error);
        return;
      }

      console.log(
        "✅ Onboarding completed without calendar, redirecting to dashboard"
      );
      // The finalizeOnboarding action will handle the redirect
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const progress = 100; // Final step

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
    >
      <div className="w-full h-full max-w-[700px] mx-auto">
        <div className="relative z-10 space-y-6 w-full">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-4 sm:px-6 lg:px-8">
            <span>Final Step</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-accent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-6 lg:px-8">
            <Card className="lg:col-span-8 bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">
                    Connect Your Calendar
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Connect your Google Calendar to enable smart scheduling and
                    meeting insights
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-destructive text-sm">{error}</p>
                    </div>
                  )}

                  {/* Calendar Connection Section */}
                  <div className="border border-border rounded-lg p-6 space-y-4">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          calendarConnected ? "bg-green-100" : "bg-blue-100"
                        }`}
                      >
                        {calendarConnected ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Calendar className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {calendarConnected
                            ? "Calendar Connected!"
                            : "Google Calendar Integration"}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {calendarConnected
                            ? "Your calendar is now connected and ready to use"
                            : "Sync your calendar to enable smart scheduling, meeting insights, and automatic note-taking"}
                        </p>
                      </div>
                    </div>

                    {!calendarConnected && (
                      <div className="space-y-3">
                        <CalendarConnectionButton
                          isConnected={calendarConnected}
                          onConnectionChange={setCalendarConnected}
                        />

                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            We'll only access calendar events to provide meeting
                            insights
                          </p>
                        </div>
                      </div>
                    )}

                    {calendarConnected && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <p className="text-sm font-medium text-green-800">
                            Calendar Successfully Connected
                          </p>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          You can manage calendar settings from your dashboard
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Debug section for development */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="text-center space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const response = await fetch("/api/debug/profile");
                            const data = await response.json();
                            console.log("Current profile status:", data);
                            alert("Check console for profile debug info");
                          } catch (error) {
                            console.error("Debug error:", error);
                          }
                        }}
                        className="text-xs"
                      >
                        Debug Profile Status
                      </Button>
                    </div>
                  )}
                </CardContent>

                <div className="flex justify-between items-center p-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/onboarding")}
                    disabled={isCompleting}
                    className="border-border hover:bg-accent/50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Questions
                  </Button>

                  <div className="flex space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleSkipCalendar}
                      disabled={isCompleting}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Skip for now
                    </Button>

                    <Button
                      onClick={handleCompleteOnboarding}
                      disabled={!calendarConnected || isCompleting}
                      className="bg-green-600 text-white hover:bg-green-600/90"
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Completing Setup...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
