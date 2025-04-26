// src/app/api/pricing/plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPricingPlans } from "@/utils/stripe/server";

export async function GET(_req: NextRequest) {
  try {
    const plans = await getPricingPlans();

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing plans" },
      { status: 500 }
    );
  }
}
