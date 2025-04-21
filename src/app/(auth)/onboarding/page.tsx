"use client";

import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { OnboardingSteps } from "./components/OnboardingSteps";
import { useAuth } from "@/contexts/AuthContext";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center">
        <Loader className="animate-spin h-8 w-8 text-indigo-600 mb-4" />
        <p className="text-indigo-600">Loading...</p>
      </div>
    </div>
  );
}

function OnboardingContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return null; // Will redirect to login via the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to ARTI Notes
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Let's set up your account
          </p>
        </div>

        <OnboardingSteps />

        <div className="text-center text-sm text-gray-500">
          <p>
            Step {user ? "1 of 6" : ""} - This will help us customize your
            experience
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <Suspense fallback={<LoadingFallback />}>
        <OnboardingContent />
      </Suspense>
    </OnboardingProvider>
  );
}
