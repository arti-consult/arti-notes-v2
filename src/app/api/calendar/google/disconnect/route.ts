import { NextRequest, NextResponse } from "next/server";
import { disconnectGoogleCalendar } from "@/utils/calendar/google-calendar";
import { createClient } from "@/utils/supabase/server";

export async function POST(_request: NextRequest) {
  const supabase = await createClient();

  // Verify user is authenticated
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Disconnect Google Calendar
  const success = await disconnectGoogleCalendar(user.id);

  if (!success) {
    return NextResponse.json(
      { error: "Failed to disconnect Google Calendar" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
