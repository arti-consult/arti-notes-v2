"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export function OnboardingSteps() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, dispatch, submitOnboarding, requestMicPermission } =
    useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const handlePrevStep = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const handleMicPermission = async () => {
    try {
      await requestMicPermission();
    } catch (error) {
      console.error("Error requesting mic permission:", error);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await submitOnboarding(user.id);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine if the current step is complete
  const isStepComplete = () => {
    switch (state.step) {
      case 1:
        return !!state.userType;
      case 2:
        return !!state.teamSize;
      case 3:
        return !!state.referralSource;
      case 4:
        return !!state.audioPurpose;
      case 5:
        return state.micPermission !== null;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (state.step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">About You</CardTitle>
              <CardDescription>Tell us a bit about yourself</CardDescription>
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
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="flex-1 cursor-pointer">
                    Individual
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company" className="flex-1 cursor-pointer">
                    Company
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </>
        );

      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Team Size</CardTitle>
              <CardDescription>How large is your team?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={state.teamSize || ""}
                onValueChange={(value) =>
                  dispatch({
                    type: "SET_TEAM_SIZE",
                    payload: value as "solo" | "small" | "medium" | "large",
                  })
                }
              >
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="solo" id="solo" />
                  <Label htmlFor="solo" className="flex-1 cursor-pointer">
                    Just me
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small" className="flex-1 cursor-pointer">
                    2-10 people
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="flex-1 cursor-pointer">
                    11-50 people
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large" className="flex-1 cursor-pointer">
                    51+ people
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </>
        );

      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">
                How did you hear about us?
              </CardTitle>
              <CardDescription>
                We'd love to know how you found our service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={state.referralSource || ""}
                onValueChange={(value) =>
                  dispatch({ type: "SET_REFERRAL_SOURCE", payload: value })
                }
              >
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="search" id="search" />
                  <Label htmlFor="search" className="flex-1 cursor-pointer">
                    Search engine
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="social" id="social" />
                  <Label htmlFor="social" className="flex-1 cursor-pointer">
                    Social media
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="friend" id="friend" />
                  <Label htmlFor="friend" className="flex-1 cursor-pointer">
                    Friend or colleague
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex-1 cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>

              {state.referralSource === "other" && (
                <div className="mt-4">
                  <Label htmlFor="referral-details">Please specify</Label>
                  <Input
                    id="referral-details"
                    placeholder="Where did you hear about us?"
                    onChange={(e) =>
                      dispatch({
                        type: "SET_REFERRAL_SOURCE",
                        payload: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </CardContent>
          </>
        );

      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">
                How will you use our service?
              </CardTitle>
              <CardDescription>
                This helps us tailor the experience to your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="audio-purpose">
                Please describe your main use case
              </Label>
              <Textarea
                id="audio-purpose"
                placeholder="E.g., Recording team meetings, client calls, personal notes..."
                value={state.audioPurpose || ""}
                onChange={(e) =>
                  dispatch({
                    type: "SET_AUDIO_PURPOSE",
                    payload: e.target.value,
                  })
                }
                rows={4}
              />
            </CardContent>
          </>
        );

      case 5:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Microphone Access</CardTitle>
              <CardDescription>
                To record your meetings, we'll need access to your microphone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 space-y-4">
                {state.micPermission === true ? (
                  <>
                    <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                      <Mic className="h-12 w-12 text-green-600" />
                    </div>
                    <p className="text-green-600 font-medium text-center">
                      Microphone access granted. Thank you!
                    </p>
                  </>
                ) : state.micPermission === false ? (
                  <>
                    <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                      <MicOff className="h-12 w-12 text-red-600" />
                    </div>
                    <p className="text-red-600 font-medium text-center">
                      Microphone access denied. Please enable it in your browser
                      settings.
                    </p>
                    <Button variant="outline" onClick={handleMicPermission}>
                      Try Again
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mic className="h-12 w-12 text-blue-600" />
                    </div>
                    <p className="text-center">
                      Please allow microphone access when prompted by your
                      browser.
                    </p>
                    <Button variant="outline" onClick={handleMicPermission}>
                      Request Microphone Access
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </>
        );

      case 6:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">All Set!</CardTitle>
              <CardDescription>
                Thank you for completing the onboarding process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <p className="text-center">
                  You're all set to start using our service. Click "Complete" to
                  go to your dashboard.
                </p>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      {renderStepContent()}

      {error && (
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      )}

      <CardFooter className="flex justify-between">
        {state.step > 1 && (
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        {state.step < 6 ? (
          <Button
            onClick={handleNextStep}
            disabled={!isStepComplete() || isSubmitting}
            className={state.step === 1 ? "ml-auto" : ""}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="ml-auto"
          >
            {isSubmitting ? "Completing..." : "Complete"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
