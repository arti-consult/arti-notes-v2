import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify the requesting user matches the userId parameter
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check payment status in onboarding table
    const { data, error } = await supabase
      .from("user_onboarding")
      .select("payment_completed")
      .eq("user_id", userId)
      .maybeSingle(); // Use maybeSingle to handle no records

    if (error && error.code !== "PGRST116") {
      // PGRST116 = Row not found, which is fine for new users
      console.error("Error checking payment status:", error);
      return NextResponse.json(
        { error: "Failed to check payment status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paymentCompleted: data?.payment_completed || false,
    });
  } catch (error) {
    console.error("Unexpected error checking payment status:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        paymentCompleted: false,
      },
      { status: 500 }
    );
  }
}
