"use client";

import { OnboardingProvider } from "@/contexts/OnboardingContext";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <OnboardingProvider>{children}</OnboardingProvider>
    </div>
  );
}
