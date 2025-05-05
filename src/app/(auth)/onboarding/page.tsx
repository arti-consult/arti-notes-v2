"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingSteps } from "./components/OnboardingSteps";

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { state, dispatch } = useOnboarding();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user || !searchParams.has("success")) return;

      try {
        const response = await fetch(
          `/api/onboarding/payment-status?userId=${user.id}`
        );
        const data = await response.json();

        if (data.paymentCompleted) {
          dispatch({ type: "SET_PAYMENT_COMPLETED", payload: true });
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    checkPaymentStatus();
  }, [user, searchParams, dispatch]);

  return (
    <div className="container max-w-4xl py-8">
      <OnboardingSteps />
    </div>
  );
}
