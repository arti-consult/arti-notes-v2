// src/types/subscription.ts
export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  stripePriceId: string;
  features: string[];
  meetingMinutes: number; // Base minutes included in plan
  aiToolsAccess: string[]; // List of AI tools available in this tier
  maxTeamMembers: number; // Number of team members allowed
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  stripePriceId: string;
  minutes: number; // Additional minutes provided by this package
}

export interface UserSubscription {
  id: string;
  userId: string;
  tierId: string;
  stripeSubscriptionId: string;
  status:
    | "active"
    | "canceled"
    | "past_due"
    | "trialing"
    | "incomplete"
    | "incomplete_expired"
    | "unpaid";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  minutesUsed: number; // Track minutes used in current period
  minutesRemaining: number; // Track remaining minutes (base + credits)
  additionalCredits: number; // Additional credits purchased
  createdAt: Date;
  updatedAt: Date;
}

// Example pricing tiers
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    description: "For individuals just getting started",
    price: 0,
    interval: "month",
    stripePriceId: "price_free",
    features: [
      "Up to 60 minutes of meetings per month",
      "Basic AI transcription",
      "Meeting summaries",
      "7-day history",
    ],
    meetingMinutes: 60,
    aiToolsAccess: ["basic-transcription", "basic-summary"],
    maxTeamMembers: 1,
  },
  {
    id: "standard",
    name: "Standard",
    description: "For professionals and small teams",
    price: 19.99,
    interval: "month",
    stripePriceId: "price_standard_monthly",
    features: [
      "Up to A5 minutes of meetings per month",
      "Advanced AI transcription",
      "Detailed summaries with action items",
      "Unlimited history",
      "Export to popular formats",
    ],
    meetingMinutes: 300,
    aiToolsAccess: [
      "advanced-transcription",
      "detailed-summary",
      "action-items",
      "export",
    ],
    maxTeamMembers: 3,
  },
  {
    id: "premium",
    name: "Premium",
    description: "For teams and businesses",
    price: 49.99,
    interval: "month",
    stripePriceId: "price_premium_monthly",
    features: [
      "Up to 1000 minutes of meetings per month",
      "Real-time transcription and analysis",
      "Advanced analytics and insights",
      "Custom AI models",
      "Team collaboration features",
      "Priority support",
    ],
    meetingMinutes: 1000,
    aiToolsAccess: [
      "real-time-transcription",
      "advanced-analytics",
      "custom-models",
      "team-collaboration",
    ],
    maxTeamMembers: 10,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: 149.99,
    interval: "month",
    stripePriceId: "price_enterprise_monthly",
    features: [
      "Unlimited minutes of meetings",
      "Dedicated account manager",
      "Custom integrations",
      "SSO and advanced security",
      "SLA guarantees",
    ],
    meetingMinutes: Infinity,
    aiToolsAccess: ["all"],
    maxTeamMembers: Infinity,
  },
];

// Example credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "small",
    name: "Small Package",
    description: "100 additional minutes",
    price: 9.99,
    stripePriceId: "price_small_credit_package",
    minutes: 100,
  },
  {
    id: "medium",
    name: "Medium Package",
    description: "300 additional minutes",
    price: 24.99,
    stripePriceId: "price_medium_credit_package",
    minutes: 300,
  },
  {
    id: "large",
    name: "Large Package",
    description: "800 additional minutes",
    price: 59.99,
    stripePriceId: "price_large_credit_package",
    minutes: 800,
  },
];
