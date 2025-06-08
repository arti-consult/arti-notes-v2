"use client";

import { OnboardingSteps } from "./components/OnboardingSteps";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Animated background gradients */}

      <div className="w-full h-full max-w-[700px] mx-auto">
        <OnboardingSteps />
      </div>
    </motion.div>
  );
}
