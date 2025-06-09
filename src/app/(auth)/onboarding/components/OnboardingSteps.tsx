"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

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
      <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          Calendar Connected!
        </span>
      </div>
    );
  }

  if (connectionStatus === "error") {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <span className="text-sm text-red-800">
            Failed to connect calendar. Please try again.
          </span>
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
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Calendar className="mr-2 h-4 w-4" />
          Connect Google Calendar
        </>
      )}
    </Button>
  );
}

export function OnboardingSteps() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { state, dispatch, submitOnboarding } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false);

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

  const handleNextStep = () => {
    // Don't allow going to step 4 without submitting answers first
    if (state.step === 3 && !questionsSubmitted) {
      setError(
        "Please submit your answers first before proceeding to calendar connection"
      );
      return;
    }
    dispatch({ type: "NEXT_STEP" });
  };

  const handlePrevStep = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const handleSubmitQuestions = async () => {
    if (!user) {
      setError("You must be logged in to complete onboarding");
      return;
    }

    // Check if we have the required answers
    if (!state.userType || !state.referralSource) {
      setError("Please complete all required fields before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      console.log("🔄 Submitting onboarding questions:", {
        userType: state.userType,
        referralSource: state.referralSource,
      });

      const result = await submitOnboarding(user.id);

      console.log(
        "✅ Questions submitted successfully, moving to calendar connection"
      );
      setQuestionsSubmitted(true);

      // Move to next step (calendar connection)
      dispatch({ type: "NEXT_STEP" });
    } catch (error) {
      console.error("Error submitting onboarding questions:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!questionsSubmitted) {
      setError("Please complete the questions first");
      return;
    }

    if (!calendarConnected) {
      setError("Please connect your calendar to complete setup");
      return;
    }

    if (!user) {
      setError("Authentication required");
      return;
    }

    try {
      setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  const isStepComplete = () => {
    const stepChecks = {
      1: !!state.userType,
      2: !!state.referralSource,
      3: !!(state.userType && state.referralSource), // Can submit if both answers are provided
      4: calendarConnected, // Calendar must be connected to complete
    };
    return stepChecks[state.step as keyof typeof stepChecks] ?? false;
  };

  const renderStepContent = () => {
    const steps = {
      1: (
        <>
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              About You
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Are you signing up as an individual or for a company?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={state.userType || ""}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_USER_TYPE",
                  payload: value as "individual" | "company",
                })
              }
            >
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="individual" id="individual" />
                <div className="flex-1 cursor-pointer">
                  <Label
                    htmlFor="individual"
                    className="cursor-pointer font-medium"
                  >
                    Individual
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Personal use, freelancing, or side projects
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="company" id="company" />
                <div className="flex-1 cursor-pointer">
                  <Label
                    htmlFor="company"
                    className="cursor-pointer font-medium"
                  >
                    Company
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Business, startup, or organization
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </>
      ),
      2: (
        <>
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              How did you hear about us?
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Help us understand how you discovered our platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={state.referralSource || ""}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_REFERRAL_SOURCE",
                  payload: value,
                })
              }
            >
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="google" id="google" />
                <Label htmlFor="google" className="flex-1 cursor-pointer">
                  Google Search
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="social_media" id="social_media" />
                <Label htmlFor="social_media" className="flex-1 cursor-pointer">
                  Social Media (Twitter, LinkedIn, Facebook)
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="friend_referral" id="friend_referral" />
                <Label
                  htmlFor="friend_referral"
                  className="flex-1 cursor-pointer"
                >
                  Friend or Colleague Referral
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="blog_article" id="blog_article" />
                <Label htmlFor="blog_article" className="flex-1 cursor-pointer">
                  Blog or Article
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="youtube" id="youtube" />
                <Label htmlFor="youtube" className="flex-1 cursor-pointer">
                  YouTube
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="podcast" id="podcast" />
                <Label htmlFor="podcast" className="flex-1 cursor-pointer">
                  Podcast
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="newsletter" id="newsletter" />
                <Label htmlFor="newsletter" className="flex-1 cursor-pointer">
                  Newsletter or Email
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="flex-1 cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </>
      ),
      3: (
        <>
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              Connect Your Calendar
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {state.userType && state.referralSource
                ? "Great! You can optionally connect your calendar, then complete setup"
                : "First complete the questions above, then connect your calendar"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-foreground font-medium">
                  Perfect! Here's your progress:
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Account type:</span>
                    <span className="font-medium text-foreground">
                      {state.userType === "individual"
                        ? "Individual"
                        : "Company"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Found us via:</span>
                    <span className="font-medium text-foreground">
                      {state.referralSource
                        ?.replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Calendar:</span>
                    <span
                      className={`font-medium ${
                        calendarConnected ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {calendarConnected ? "Connected ✅" : "Not connected ⚪"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Connection Section */}
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    calendarConnected ? "bg-green-100" : "bg-blue-100"
                  }`}
                >
                  {calendarConnected ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {calendarConnected
                      ? "Calendar Connected!"
                      : "Connect Google Calendar"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {calendarConnected
                      ? "Your calendar is now connected and ready to use"
                      : "Sync your calendar to enable smart scheduling and meeting insights"}
                  </p>
                </div>
              </div>

              <CalendarConnectionButton
                isConnected={calendarConnected}
                onConnectionChange={setCalendarConnected}
              />
            </div>

            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {calendarConnected
                  ? "Great! You can manage your calendar settings from your dashboard later"
                  : "You can also connect your calendar later from your dashboard settings"}
              </p>

              {/* Debug button - remove in production */}
              {process.env.NODE_ENV === "development" && (
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
              )}
            </div>
          </CardContent>
        </>
      ),
    };

    return steps[state.step as keyof typeof steps];
  };

  const progress = (state.step / 3) * 100; // Changed from 5 to 3 steps

  return (
    <div className="relative w-full mx-auto">
      <div className="relative z-10 space-y-6 w-full">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-4 sm:px-6 lg:px-8">
          <span>Step {state.step} of 4</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-accent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-6 lg:px-8">
          <Card className="lg:col-span-8 bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {renderStepContent()}
            </motion.div>

            {error && (
              <CardContent>
                <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20">
                  {error}
                </p>
              </CardContent>
            )}

            <CardFooter className="flex justify-between pt-6 border-t border-border">
              {state.step > 1 && state.step !== 4 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="border-border hover:bg-accent/50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}

              {/* Step 4 has special back handling since questions are submitted */}
              {state.step === 4 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Can go back to review answers but they're already submitted
                    dispatch({ type: "PREV_STEP" });
                  }}
                  disabled={isSubmitting}
                  className="border-border hover:bg-accent/50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Review Answers
                </Button>
              )}

              {state.step < 3 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={!isStepComplete() || isSubmitting}
                  className={`${
                    state.step === 1 ? "ml-auto" : ""
                  } bg-primary text-primary-foreground hover:bg-primary/90`}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : state.step === 3 ? (
                <Button
                  onClick={handleSubmitQuestions}
                  disabled={!isStepComplete() || isSubmitting}
                  className="ml-auto bg-blue-600 text-white hover:bg-blue-600/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Answers"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteOnboarding}
                  disabled={!calendarConnected}
                  className="ml-auto bg-green-600 text-white hover:bg-green-600/90"
                >
                  Complete Setup
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
