// src/types/subscription.ts
export interface PricingPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  interval: "month" | "year";
  stripe_price_id: string;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_subscription_id: string | null;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  plan?: PricingPlan; // Optional joined field
}
