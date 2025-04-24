import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@/utils/supabase/client';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

export async function getGoogleAccessToken(userId: string): Promise<string | null> {
  try {
    const supabase = createClient();
    
    // Get the user's calendar connection
    const { data: connection, error } = await supabase
      .from('calendar_connections')
      .select('refresh_token')
      .eq('user_id', userId)
      .single();

    if (error || !connection?.refresh_token) {
      console.error('Failed to get calendar connection:', error);
      return null;
    }

    // Create OAuth2 client
    const oauth2Client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: connection.refresh_token
    });

    // Get fresh access token using refresh token
    const response = await oauth2Client.getAccessToken();
    return response.token || null;
  } catch (error) {
    console.error('Error getting Google access token:', error);
    return null;
  }
} 