"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/sign-up");
      return;
    }

    // Check if user already completed payment
    checkPaymentStatus();
  }, [user, router]);

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
        setPaymentCompleted(true);
        // Redirect to onboarding after a delay
        setTimeout(() => {
          router.push("/onboarding");
        }, 2000);
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

      const response = await fetch("/api/payment/create-checkout", {
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

  if (paymentCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
      >
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Payment Successful!
                </h2>
                <p className="text-muted-foreground mt-2">
                  Redirecting you to complete your profile setup...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">
            Start Your Free Trial
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Get started with our 14-day free trial
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            {isCheckingPayment ? (
              <>
                <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <p className="text-primary font-medium text-center">
                  Checking payment status...
                </p>
              </>
            ) : (
              <>
                <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center">
                  <CreditCard className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    Complete Your Registration
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add your payment details to start your free trial. You won't
                    be charged until the trial ends.
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
              </>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleCreateCheckout}
            disabled={isCreatingCheckout || isCheckingPayment}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
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
            className="w-full border-border hover:bg-accent/50"
          >
            Check Payment Status
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
