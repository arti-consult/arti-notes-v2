import { NextRequest, NextResponse } from "next/server";
import { createSubscriptionCheckout } from "@/utils/stripe/stripe-service";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const checkoutUrl = await createSubscriptionCheckout(
      userId,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "",
      `${req.headers.get("origin")}/onboarding`
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
