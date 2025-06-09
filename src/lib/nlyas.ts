// src/lib/nlyas.ts
import Nylas from "nylas";

export const nylasConfig = {
  apiKey: process.env.NYLAS_API_KEY!,
  clientId: process.env.NYLAS_CLIENT_ID!,
  callbackUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/nylas/callback`,
};

export const nylas = new Nylas({
  apiKey: nylasConfig.apiKey,
  apiUri: process.env.NYLAS_API_URI || "https://api.nylas.com",
});

// Helper function to get authorization URL
export function getNylasAuthUrl(userId?: string) {
  return nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.callbackUri,
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    state: userId, // Pass user ID for tracking
  });
}
