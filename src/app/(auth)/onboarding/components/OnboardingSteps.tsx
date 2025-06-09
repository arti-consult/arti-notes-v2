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
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export function OnboardingSteps() {
  const router = useRouter();
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

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to complete onboarding");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await submitOnboarding(user.id);
      router.push("/dashboard");
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
      2: !!state.teamSize,
      3: !!state.referralSource,
      4: !!state.audioPurpose,
      5: true, // Final step
    };
    return stepChecks[state.step as keyof typeof stepChecks] ?? false;
  };

  // Simplified steps without payment
  const renderStepContent = () => {
    const steps = {
      1: (
        <>
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">
              About You
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Tell us a bit about yourself
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
                <Label htmlFor="individual" className="flex-1 cursor-pointer">
                  Individual
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company" className="flex-1 cursor-pointer">
                  Company
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </>
      ),
      // ... Steps 2, 3, 4 remain the same ...
      5: (
        <>
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">All Set!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Welcome to our platform! You're ready to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-foreground text-center">
                You're all set! Click "Complete" to go to your dashboard and
                start using our service.
              </p>
            </div>
          </CardContent>
        </>
      ),
    };

    return steps[state.step as keyof typeof steps];
  };

  const progress = (state.step / 5) * 100; // Changed from 7 to 5 steps

  return (
    <div className="relative w-full mx-auto">
      <div className="relative z-10 space-y-6 w-full">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-4 sm:px-6 lg:px-8">
          <span>Step {state.step} of 5</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-accent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-6 lg:px-8">
          <Card className="lg:col-span-8 bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
            <motion.div
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
              {state.step < 5 ? (
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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="ml-auto bg-green-600 text-white hover:bg-green-600/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    "Complete"
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
