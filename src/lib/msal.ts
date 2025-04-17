import { PublicClientApplication, Configuration } from "@azure/msal-browser";
import { validateEnv } from "./env";

const env = validateEnv();

// Simplified configuration for bolt.new environment
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/common`,
    redirectUri: window.location.origin + "/auth/callback/microsoft",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL silently
msalInstance.initialize().catch(console.error);

export const loginScopes = [
  "Calendars.Read",
  "OnlineMeetings.ReadWrite",
  "offline_access",
];
