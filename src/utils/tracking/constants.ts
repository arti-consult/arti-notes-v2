// src/utils/tracking/constants.ts

// Cookie names
export const UTM_COOKIE_NAME = "arti_utm_data";
export const VISIT_COOKIE_NAME = "arti_visit_data";
export const ANONYMOUS_ID_COOKIE = "arti_anonymous_id";

// Cookie settings
export const COOKIE_OPTIONS = {
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
