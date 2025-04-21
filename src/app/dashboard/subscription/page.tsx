import { createClient } from "@/utils/supabase/server";
import { PricingTier } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

export default async function SubscriptionPage() {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Get pricing plans from the database
  const { data: plans, error: plansError } = await supabase
    .from("pricing_plans")
    .select("*")
    .order("price");

  // Get team members count
  const { data: teamMembers, error: teamError } = await supabase
    .from("team_members")
    .select("id", { count: "exact" });

  if (plansError) {
    console.error("Error fetching pricing plans:", plansError);
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground">Failed to load pricing plans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">
          View and manage your subscription plans
        </p>
      </div>

      {/* Team Members Count */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
          <CardDescription>
            Current team size and subscription limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-full">
              <Users className="h-6 w-6 text-violet-700" />
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {teamMembers?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-muted">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                ${plan.price}/{plan.interval}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
