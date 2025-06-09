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
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export function OnboardingSteps() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { state, dispatch, submitOnboarding } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const handlePrevStep = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const handleSubmitOnboarding = async () => {
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

      console.log("🔄 Submitting onboarding answers:", {
        userType: state.userType,
        referralSource: state.referralSource,
      });

      const result = await submitOnboarding(user.id);

      console.log(
        "✅ Onboarding answers submitted successfully, redirecting to calendar connection"
      );

      // Redirect to calendar connection page
      router.push("/onboarding/connect-account");
    } catch (error) {
      console.error("Error submitting onboarding:", error);
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
    };

    return steps[state.step as keyof typeof steps];
  };

  const totalSteps = 2; // Reduced from 4 to 2
  const progress = (state.step / totalSteps) * 100;

  return (
    <div className="relative w-full mx-auto">
      <div className="relative z-10 space-y-6 w-full">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-4 sm:px-6 lg:px-8">
          <span>
            Step {state.step} of {totalSteps}
          </span>
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
              {state.step > 1 && (
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

              {state.step < totalSteps ? (
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
              ) : (
                <Button
                  onClick={handleSubmitOnboarding}
                  disabled={!isStepComplete() || isSubmitting}
                  className="ml-auto bg-blue-600 text-white hover:bg-blue-600/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Continue to Calendar Setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
