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
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.8 }}
        className="absolute w-[1200px] h-[1200px] bg-[#145DFC] rounded-full blur-[256px]"
      />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="container min-w-4xl py-8 relative z-10"
      >
        <OnboardingSteps />
      </motion.div>
    </motion.div>
  );
}
