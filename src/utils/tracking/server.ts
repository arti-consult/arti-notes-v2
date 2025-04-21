"use server";

// src/utils/tracking/server.ts
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { UTMParams } from "./utm";
import {
  UTM_COOKIE_NAME,
  VISIT_COOKIE_NAME,
  ANONYMOUS_ID_COOKIE,
  COOKIE_OPTIONS,
} from "./constants";

/**
 * Get cookie store, handling both Pages Router and App Router
 */
async function getCookieStore() {
  const cookieStore = cookies();
  return cookieStore instanceof Promise ? await cookieStore : cookieStore;
}

/**
 * Link anonymous tracking data to a user after they sign up or log in
 */
export async function linkTrackingDataToUser(userId: string): Promise<void> {
  try {
    const supabase = await createClient();
    const cookieStore = await getCookieStore();

    // Get anonymous ID from cookies
    const anonymousId = cookieStore.get(ANONYMOUS_ID_COOKIE)?.value;

    if (!anonymousId) {
      return;
    }

    // Update all tracking data records with this anonymous ID to link to the user
    await supabase
      .from("tracking_data")
      .update({ user_id: userId })
      .eq("anonymous_id", anonymousId)
      .is("user_id", null);
  } catch (error) {
    console.error("Error linking tracking data to user:", error);
  }
}

/**
 * Get the latest tracking data for a user
 */
export async function getUserTrackingData(userId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tracking_data")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error getting user tracking data:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting user tracking data:", error);
    return null;
  }
}

/**
 * Save UTM data during onboarding
 */
export async function saveUTMDataDuringOnboarding(
  userId: string,
  onboardingId: string
): Promise<void> {
  try {
    const supabase = await createClient();

    // Get latest tracking data for the user
    const trackingData = await getUserTrackingData(userId);

    if (!trackingData) return;

    // Update onboarding record with UTM data
    await supabase
      .from("user_onboarding")
      .update({
        tracking_data_id: trackingData.id,
        utm_source: trackingData.utm_source,
        utm_medium: trackingData.utm_medium,
        utm_campaign: trackingData.utm_campaign,
        referrer: trackingData.referrer,
      })
      .eq("id", onboardingId);
  } catch (error) {
    console.error("Error saving UTM data during onboarding:", error);
  }
}

/**
 * Get UTM data from cookie on the server
 */
export async function getServerUTMData(): Promise<UTMParams | null> {
  try {
    const cookieStore = await getCookieStore();
    const utmData = cookieStore.get(UTM_COOKIE_NAME);
    return utmData ? JSON.parse(utmData.value) : null;
  } catch (error) {
    console.error("Error getting server UTM data:", error);
    return null;
  }
}

/**
 * Get visit data from cookie on the server
 */
export async function getServerVisitData(): Promise<{
  first_visit?: string;
  referrer?: string;
  landing_page?: string;
} | null> {
  try {
    const cookieStore = await getCookieStore();
    const visitData = cookieStore.get(VISIT_COOKIE_NAME);
    return visitData ? JSON.parse(visitData.value) : null;
  } catch (error) {
    console.error("Error getting server visit data:", error);
    return null;
  }
}

/**
 * Get anonymous ID from cookie on the server
 */
export async function getServerAnonymousId(): Promise<string | null> {
  try {
    const cookieStore = await getCookieStore();
    const anonymousId = cookieStore.get(ANONYMOUS_ID_COOKIE);
    return anonymousId ? anonymousId.value : null;
  } catch (error) {
    console.error("Error getting server anonymous ID:", error);
    return null;
  }
}

/**
 * Get all tracking data from cookies on the server
 */
export async function getServerTrackingData(): Promise<{
  utmData: UTMParams | null;
  visitData: {
    first_visit?: string;
    referrer?: string;
    landing_page?: string;
  } | null;
  anonymousId: string | null;
}> {
  const [utmData, visitData, anonymousId] = await Promise.all([
    getServerUTMData(),
    getServerVisitData(),
    getServerAnonymousId(),
  ]);

  return {
    utmData,
    visitData,
    anonymousId,
  };
}

/**
 * Set UTM data in cookie on the server
 */
export async function setServerUTMData(data: UTMParams): Promise<void> {
  try {
    const cookieStore = await getCookieStore();
    cookieStore.set(UTM_COOKIE_NAME, JSON.stringify(data), COOKIE_OPTIONS);
  } catch (error) {
    console.error("Error setting server UTM data:", error);
  }
}

/**
 * Set visit data in cookie on the server
 */
export async function setServerVisitData(data: {
  first_visit: string;
  referrer?: string;
  landing_page: string;
}): Promise<void> {
  try {
    const cookieStore = await getCookieStore();
    cookieStore.set(VISIT_COOKIE_NAME, JSON.stringify(data), COOKIE_OPTIONS);
  } catch (error) {
    console.error("Error setting server visit data:", error);
  }
}

/**
 * Set anonymous ID in cookie on the server
 */
export async function setServerAnonymousId(id: string): Promise<void> {
  try {
    const cookieStore = await getCookieStore();
    cookieStore.set(ANONYMOUS_ID_COOKIE, id, {
      ...COOKIE_OPTIONS,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });
  } catch (error) {
    console.error("Error setting server anonymous ID:", error);
  }
}

/**
 * Clear all tracking cookies on the server
 */
export async function clearServerTrackingCookies(): Promise<void> {
  try {
    const cookieStore = await getCookieStore();
    cookieStore.delete(UTM_COOKIE_NAME);
    cookieStore.delete(VISIT_COOKIE_NAME);
    cookieStore.delete(ANONYMOUS_ID_COOKIE);
  } catch (error) {
    console.error("Error clearing server tracking cookies:", error);
  }
}
