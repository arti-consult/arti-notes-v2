// src/utils/tracking/utm.ts
import {
  getClientUTMData,
  getClientVisitData,
  setClientUTMData,
  setClientVisitData,
  clearClientTrackingCookies,
} from "./client";
import { UTM_COOKIE_NAME, VISIT_COOKIE_NAME } from "./constants";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
  first_visit?: string;
}

/**
 * Capture UTM parameters from URL and store in cookies
 */
export async function captureUTMParameters(url?: string): Promise<UTMParams> {
  // Use provided URL or current window URL
  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  if (!currentUrl) return {};

  try {
    const urlObj = new URL(currentUrl);
    const searchParams = urlObj.searchParams;

    // Extract UTM parameters
    const utmParams: UTMParams = {
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_term: searchParams.get("utm_term") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
    };

    // Only save if at least one UTM parameter is present
    if (Object.values(utmParams).some((value) => value)) {
      setClientUTMData(utmParams);
    }

    return utmParams;
  } catch (error) {
    console.error("Error capturing UTM parameters:", error);
    return {};
  }
}

/**
 * Capture visit data and store in cookies
 */
export async function captureVisitData(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const visitData = {
      first_visit: new Date().toISOString(),
      referrer: document.referrer || undefined,
      landing_page: window.location.href,
    };

    setClientVisitData(visitData);
  } catch (error) {
    console.error("Error capturing visit data:", error);
  }
}

/**
 * Get UTM data from cookie
 */
export async function getUTMDataFromCookie(): Promise<UTMParams | null> {
  return getClientUTMData();
}

/**
 * Get visit data from cookie
 */
export async function getVisitDataFromCookie(): Promise<{
  first_visit?: string;
  referrer?: string;
  landing_page?: string;
} | null> {
  return getClientVisitData();
}

/**
 * Get all tracking data (UTM + visit data)
 */
export async function getAllTrackingData(): Promise<UTMParams> {
  const utmData = (await getUTMDataFromCookie()) || {};
  const visitData = (await getVisitDataFromCookie()) || {};

  return {
    ...utmData,
    ...visitData,
  };
}

/**
 * Clear all tracking cookies
 */
export async function clearTrackingCookies(): Promise<void> {
  clearClientTrackingCookies();
}
