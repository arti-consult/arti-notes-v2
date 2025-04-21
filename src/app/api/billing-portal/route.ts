// src/app/api/billing-portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createPortalSession } from "@/utils/stripe/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get redirect URL from query params or use dashboard as default
    const url = new URL(req.url);
    const returnUrl =
      url.searchParams.get("return_url") ||
      `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;

    // Create billing portal session
    const portalUrl = await createPortalSession(user.id, returnUrl);

    return NextResponse.json({ url: portalUrl });
  } catch (error: any) {
    console.error("Error creating billing portal session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
