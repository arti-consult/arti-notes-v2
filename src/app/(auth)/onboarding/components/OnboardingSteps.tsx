// src/app/(auth)/onboarding/components/OnboardingSteps.tsx
"use client";

import { useState, useEffect } from "react";
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
import {
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

// Animation variants using theme animations
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: "easeInOut" },
};

const slideIn = {
  initial: { opacity: 0, x: -200 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

// Step components
const StepHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <CardHeader>
    <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
    <CardDescription className="text-muted-foreground">
      {description}
    </CardDescription>
  </CardHeader>
);

const RadioOption = ({
  value,
  label,
  id,
}: {
  value: string;
  label: string;
  id: string;
}) => (
  <div className="flex items-center space-x-2 rounded-md border border-border p-4 hover:bg-accent/50 cursor-pointer transition-colors duration-200">
    <RadioGroupItem value={value} id={id} className="border-muted-foreground" />
    <Label htmlFor={id} className="flex-1 cursor-pointer text-foreground">
      {label}
    </Label>
  </div>
);

const StatusIcon = ({
  icon: Icon,
  color,
  bgColor,
}: {
  icon: any;
  color: string;
  bgColor: string;
}) => (
  <div
    className={`h-24 w-24 rounded-full ${bgColor} flex items-center justify-center`}
  >
    <Icon className={`h-12 w-12 ${color}`} />
  </div>
);

export function OnboardingSteps() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, dispatch, submitOnboarding, requestMicPermission } =
    useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  // Check payment status when component mounts and user is available
  useEffect(() => {
    if (user && state.step === 5 && !state.paymentCompleted) {
      checkPaymentStatus();
    }
  }, [user, state.step]);

  const checkPaymentStatus = async () => {
    if (!user) return;

    try {
      setIsCheckingPayment(true);
      const response = await fetch(
        `/api/onboarding/payment-status?userId=${user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data = await response.json();

      if (data.paymentCompleted) {
        dispatch({ type: "SET_PAYMENT_COMPLETED", payload: true });
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleCreateCheckout = async () => {
    if (!user) {
      setError("You must be logged in to start a subscription");
      return;
    }

    try {
      setIsCreatingCheckout(true);
      setError(null);

      const response = await fetch("/api/onboarding/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create checkout session. Please try again."
      );
    } finally {
      setIsCreatingCheckout(false);
    }
  };

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
      5: state.paymentCompleted === true,
      6: state.micPermission !== null,
    };
    return stepChecks[state.step as keyof typeof stepChecks] ?? false;
  };

  const renderStepContent = () => {
    const steps = {
      1: (
        <>
          <StepHeader
            title="About You"
            description="Tell us a bit about yourself"
          />
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
              <RadioOption
                value="individual"
                label="Individual"
                id="individual"
              />
              <RadioOption value="company" label="Company" id="company" />
            </RadioGroup>
          </CardContent>
        </>
      ),
      2: (
        <>
          <StepHeader title="Team Size" description="How large is your team?" />
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
              <RadioOption value="solo" label="Just me" id="solo" />
              <RadioOption value="small" label="2-10 people" id="small" />
              <RadioOption value="medium" label="11-50 people" id="medium" />
              <RadioOption value="large" label="51+ people" id="large" />
            </RadioGroup>
          </CardContent>
        </>
      ),
      3: (
        <>
          <StepHeader
            title="How did you hear about us?"
            description="We'd love to know how you found our service"
          />
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
              <RadioOption value="search" label="Search engine" id="search" />
              <RadioOption value="social" label="Social media" id="social" />
              <RadioOption
                value="friend"
                label="Friend or colleague"
                id="friend"
              />
              <RadioOption value="other" label="Other" id="other" />
            </RadioGroup>
            {state.referralSource === "other" && (
              <div className="mt-4">
                <Label htmlFor="referral-details" className="text-foreground">
                  Please specify
                </Label>
                <Input
                  id="referral-details"
                  placeholder="Where did you hear about us?"
                  onChange={(e) =>
                    dispatch({
                      type: "SET_REFERRAL_SOURCE",
                      payload: e.target.value,
                    })
                  }
                  className="bg-background border-border"
                />
              </div>
            )}
          </CardContent>
        </>
      ),
      4: (
        <>
          <StepHeader
            title="How will you use our service?"
            description="This helps us tailor the experience to your needs"
          />
          <CardContent className="space-y-4">
            <Label htmlFor="audio-purpose" className="text-foreground">
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
              className="bg-background border-border"
            />
          </CardContent>
        </>
      ),
      5: (
        <>
          <StepHeader
            title="Start Your Free Trial"
            description="Enter your payment details to start your 14-day free trial"
          />
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              {isCheckingPayment ? (
                <>
                  <StatusIcon
                    icon={Loader2}
                    color="text-primary"
                    bgColor="bg-accent"
                  />
                  <p className="text-primary font-medium text-center">
                    Checking payment status...
                  </p>
                </>
              ) : state.paymentCompleted ? (
                <>
                  <StatusIcon
                    icon={CheckCircle2}
                    color="text-green-600"
                    bgColor="bg-green-100"
                  />
                  <p className="text-green-600 font-medium text-center">
                    Payment details added successfully!
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    Your 14-day free trial has started. You won't be charged
                    until the trial ends.
                  </p>
                </>
              ) : (
                <>
                  <StatusIcon
                    icon={CreditCard}
                    color="text-primary"
                    bgColor="bg-accent"
                  />
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-foreground">
                      Start Your 14-Day Free Trial
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Enter your payment details to start your free trial. You
                      won't be charged until the trial ends.
                    </p>
                    <div className="mt-4 space-y-2">
                      {[
                        "14 days of full access",
                        "No charges during trial",
                        "Cancel anytime",
                      ].map((text) => (
                        <div
                          key={text}
                          className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateCheckout}
                    disabled={isCreatingCheckout}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                  >
                    {isCreatingCheckout ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating checkout...
                      </>
                    ) : (
                      "Start Free Trial"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={checkPaymentStatus}
                    disabled={isCheckingPayment || isCreatingCheckout}
                    className="border-border hover:bg-accent/50"
                  >
                    Check Payment Status
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </>
      ),
      6: (
        <>
          <StepHeader
            title="Microphone Access"
            description="To record your meetings, we'll need access to your microphone"
          />
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              {state.micPermission === true ? (
                <>
                  <StatusIcon
                    icon={Mic}
                    color="text-green-600"
                    bgColor="bg-green-100"
                  />
                  <p className="text-green-600 font-medium text-center">
                    Microphone access granted. Thank you!
                  </p>
                </>
              ) : state.micPermission === false ? (
                <>
                  <StatusIcon
                    icon={MicOff}
                    color="text-destructive"
                    bgColor="bg-destructive/10"
                  />
                  <p className="text-destructive font-medium text-center">
                    Microphone access denied. Please enable it in your browser
                    settings.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleMicPermission}
                    className="border-border hover:bg-accent/50"
                  >
                    Try Again
                  </Button>
                </>
              ) : (
                <>
                  <StatusIcon
                    icon={Mic}
                    color="text-primary"
                    bgColor="bg-accent"
                  />
                  <p className="text-foreground text-center">
                    Please allow microphone access when prompted by your
                    browser.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleMicPermission}
                    className="border-border hover:bg-accent/50"
                  >
                    Request Microphone Access
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </>
      ),
      7: (
        <>
          <StepHeader
            title="All Set!"
            description="Thank you for completing the onboarding process"
          />
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <StatusIcon
                icon={CheckCircle2}
                color="text-green-600"
                bgColor="bg-green-100"
              />
              <p className="text-foreground text-center">
                You're all set to start using our service. Click "Complete" to
                go to your dashboard.
              </p>
            </div>
          </CardContent>
        </>
      ),
    };

    return steps[state.step as keyof typeof steps];
  };

  const progress = (state.step / 7) * 100;

  return (
    <div className="relative w-full mx-auto">
      <div className="relative z-10 space-y-6 w-full">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 px-4 sm:px-6 lg:px-8">
          <span>Step {state.step} of 7</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-accent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-6 lg:px-8">
          <Card className="lg:col-span-8 bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
            <motion.div {...slideIn}>{renderStepContent()}</motion.div>

            {error && (
              <CardContent>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20"
                >
                  {error}
                </motion.p>
              </CardContent>
            )}

            <CardFooter className="flex justify-between pt-6 border-t border-border">
              {state.step > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={isSubmitting || isCreatingCheckout}
                  className="border-border hover:bg-accent/50 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {state.step < 7 ? (
                <Button
                  onClick={handleNextStep}
                  disabled={
                    !isStepComplete() || isSubmitting || isCreatingCheckout
                  }
                  className={`${
                    state.step === 1 ? "ml-auto" : ""
                  } bg-primary text-primary-foreground hover:bg-primary/90 transition-colors`}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="ml-auto bg-green-600 text-white hover:bg-green-600/90 transition-colors"
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
