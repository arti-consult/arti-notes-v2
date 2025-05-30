"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingSteps } from "./components/OnboardingSteps";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Animated background gradients */}

      <OnboardingSteps />
    </motion.div>
  );
}
