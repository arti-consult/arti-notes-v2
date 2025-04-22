import { createClient } from "@/utils/supabase/client";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  start_time: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new meeting
 */
export async function createMeeting(
  title: string,
  description?: string
): Promise<Meeting | null> {
  try {
    const supabase = createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting user:", userError);
      throw new Error("User not authenticated");
    }

    console.log("Creating meeting with data:", {
      title,
      description,
      userId: user.id,
    });

    // Create the meeting entry in the database
    const { data: meeting, error } = await supabase
      .from("meetings")
      .insert({
        title,
        description,
        user_id: user.id,
        start_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    if (!meeting) {
      throw new Error("No meeting ID returned from database");
    }

    return meeting;
  } catch (error) {
    console.error("Error in createMeeting:", error);
    return null;
  }
}
