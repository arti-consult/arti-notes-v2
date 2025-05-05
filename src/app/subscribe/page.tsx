"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_6oE9Ea0gHgaAgso3cd";

export default function SubscribePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    let url = STRIPE_CHECKOUT_URL;
    if (user?.email) {
      url += `?prefilled_email=${encodeURIComponent(user.email)}`;
    }
    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Start Your Subscription
          </CardTitle>
          <CardDescription className="text-center">
            Please add your payment details to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Redirecting..." : "Add Payment Details"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
