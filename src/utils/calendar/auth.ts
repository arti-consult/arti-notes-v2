import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { createClient } from "@/utils/supabase/client";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

export async function getGoogleAccessToken(
  userId: string
): Promise<string | null> {
  try {
    console.log("Getting Google access token for user:", userId);
    const supabase = createClient();

    // Get the user's calendar connection
    const { data: connection, error } = await supabase
      .from("calendar_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    if (error || !connection) {
      console.error("Failed to get calendar connection:", error);
      return null;
    }

    console.log("Found calendar connection:", {
      connectionId: connection.id,
      hasRefreshToken: !!connection.refresh_token,
      tokenExpiry: connection.token_expiry,
    });

    // Create OAuth2 client
    const oauth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: connection.refresh_token,
    });

    // Get fresh access token using refresh token
    const response = await oauth2Client.getAccessToken();

    if (!response.token) {
      console.error("Failed to get access token");
      return null;
    }

    // Update the stored tokens
    const { error: updateError } = await supabase
      .from("calendar_connections")
      .update({
        access_token: response.token,
        token_expiry: response.res?.data?.expiry_date
          ? new Date(response.res.data.expiry_date).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", connection.id);

    if (updateError) {
      console.error("Failed to update tokens:", updateError);
    } else {
      console.log("Successfully updated tokens");
    }

    return response.token;
  } catch (error) {
    console.error("Error getting Google access token:", error);
    return null;
  }
}
