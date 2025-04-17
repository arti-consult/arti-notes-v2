// src/app/pricing/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermission } from "@/contexts/PermissionContext";
import { PricingPlan } from "@/types/subscription";

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const { user, subscription } = useAuth();
  const { hasRole } = usePermission();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldHighlightUpgrade = searchParams.get("upgrade") === "true";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/pricing/plans");

        if (!response.ok) {
          throw new Error("Failed to fetch pricing plans");
        }

        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Unable to load pricing plans. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (!user) {
      // Redirect to login with redirect back to pricing
      router.push(`/login?redirect=${encodeURIComponent("/pricing")}`);
      return;
    }

    try {
      setProcessingPlanId(plan.id);

      if (plan.price === 0) {
        // Handle free plan - downgrade
        const response = await fetch("/api/subscriptions/downgrade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to process downgrade");
        }

        // Refresh the page to update subscription status
        window.location.href = "/dashboard?success=downgrade";
        return;
      }

      // For paid plans, create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.stripe_price_id,
          interval: isYearly ? "year" : "month",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Error selecting plan:", error);
      setError("Unable to process subscription. Please try again later.");
    } finally {
      setProcessingPlanId(null);
    }
  };

  const getCurrentPlanName = (): string => {
    if (!user) return "Not logged in";
    if (hasRole("admin")) return "Admin";
    if (subscription?.plan) return subscription.plan.name;
    return "Free";
  };

  const getPlanButtonText = (plan: PricingPlan): string => {
    const currentPlan = getCurrentPlanName().toLowerCase();

    if (currentPlan === plan.name.toLowerCase()) {
      return "Current Plan";
    }

    if (plan.price === 0) {
      return "Downgrade";
    }

    if (subscription) {
      return "Change Plan";
    }

    return "Get Started";
  };

  const isCurrentPlan = (plan: PricingPlan): boolean => {
    return getCurrentPlanName().toLowerCase() === plan.name.toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you and get started with your smart
            meeting assistant.
          </p>

          {shouldHighlightUpgrade && (
            <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center gap-2 max-w-xl mx-auto">
              <AlertCircle className="h-5 w-5" />
              <span>You need to upgrade your plan to access this feature.</span>
            </div>
          )}

          <div className="mt-6 inline-flex items-center p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-md ${
                !isYearly ? "bg-white shadow-sm" : ""
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-md ${
                isYearly ? "bg-white shadow-sm" : ""
              }`}
            >
              Yearly <span className="text-green-600 text-sm">Save 20%</span>
            </button>
          </div>

          {user && (
            <div className="mt-6 text-sm text-gray-600">
              Current plan:{" "}
              <span className="font-semibold">{getCurrentPlanName()}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-800 rounded-lg max-w-4xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 ${
                isCurrentPlan(plan)
                  ? "ring-2 ring-indigo-600 scale-105"
                  : "hover:scale-105"
              }`}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>

                <div className="mt-6">
                  <span className="text-5xl font-extrabold">
                    $
                    {isYearly ? (plan.price * 12 * 0.8).toFixed(2) : plan.price}
                  </span>
                  <span className="text-gray-600">
                    {plan.price === 0 ? "" : `/${isYearly ? "year" : "month"}`}
                  </span>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan(plan) || processingPlanId === plan.id}
                  className={`mt-8 w-full py-3 px-4 rounded-lg font-medium ${
                    isCurrentPlan(plan)
                      ? "bg-gray-100 text-gray-800 cursor-default"
                      : processingPlanId === plan.id
                      ? "bg-gray-200 text-gray-600 cursor-wait"
                      : plan.name === "Premium"
                      ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {processingPlanId === plan.id
                    ? "Processing..."
                    : getPlanButtonText(plan)}
                </button>
              </div>

              <div className="px-8 pb-8">
                <div className="border-t border-gray-200 pt-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
