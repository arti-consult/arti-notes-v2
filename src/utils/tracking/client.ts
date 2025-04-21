import { UTMParams } from "./utm";
import {
  UTM_COOKIE_NAME,
  VISIT_COOKIE_NAME,
  ANONYMOUS_ID_COOKIE,
  COOKIE_OPTIONS,
} from "./constants";

/**
 * Get UTM data from cookie on the client
 */
export function getClientUTMData(): UTMParams | null {
  try {
    const cookies = document.cookie.split(";");
    const utmData = cookies.find((cookie) =>
      cookie.trim().startsWith(`${UTM_COOKIE_NAME}=`)
    );
    return utmData
      ? JSON.parse(decodeURIComponent(utmData.split("=")[1]))
      : null;
  } catch (error) {
    console.error("Error getting client UTM data:", error);
    return null;
  }
}

/**
 * Get visit data from cookie on the client
 */
export function getClientVisitData(): {
  first_visit?: string;
  referrer?: string;
  landing_page?: string;
} | null {
  try {
    const cookies = document.cookie.split(";");
    const visitData = cookies.find((cookie) =>
      cookie.trim().startsWith(`${VISIT_COOKIE_NAME}=`)
    );
    return visitData
      ? JSON.parse(decodeURIComponent(visitData.split("=")[1]))
      : null;
  } catch (error) {
    console.error("Error getting client visit data:", error);
    return null;
  }
}

/**
 * Get anonymous ID from cookie on the client
 */
export function getClientAnonymousId(): string | null {
  try {
    const cookies = document.cookie.split(";");
    const anonymousId = cookies.find((cookie) =>
      cookie.trim().startsWith(`${ANONYMOUS_ID_COOKIE}=`)
    );
    return anonymousId ? decodeURIComponent(anonymousId.split("=")[1]) : null;
  } catch (error) {
    console.error("Error getting client anonymous ID:", error);
    return null;
  }
}

/**
 * Get all tracking data from cookies on the client
 */
export function getClientTrackingData(): {
  utmData: UTMParams | null;
  visitData: {
    first_visit?: string;
    referrer?: string;
    landing_page?: string;
  } | null;
  anonymousId: string | null;
} {
  return {
    utmData: getClientUTMData(),
    visitData: getClientVisitData(),
    anonymousId: getClientAnonymousId(),
  };
}

/**
 * Set UTM data in cookie on the client
 */
export function setClientUTMData(data: UTMParams): void {
  try {
    const cookieValue = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${UTM_COOKIE_NAME}=${cookieValue}; path=/; max-age=${
      30 * 24 * 60 * 60
    }; sameSite=lax${process.env.NODE_ENV === "production" ? "; secure" : ""}`;
  } catch (error) {
    console.error("Error setting client UTM data:", error);
  }
}

/**
 * Set visit data in cookie on the client
 */
export function setClientVisitData(data: {
  first_visit: string;
  referrer?: string;
  landing_page: string;
}): void {
  try {
    const cookieValue = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${VISIT_COOKIE_NAME}=${cookieValue}; path=/; max-age=${
      30 * 24 * 60 * 60
    }; sameSite=lax${process.env.NODE_ENV === "production" ? "; secure" : ""}`;
  } catch (error) {
    console.error("Error setting client visit data:", error);
  }
}

/**
 * Set anonymous ID in cookie on the client
 */
export function setClientAnonymousId(id: string): void {
  try {
    document.cookie = `${ANONYMOUS_ID_COOKIE}=${id}; path=/; max-age=${
      365 * 24 * 60 * 60
    }; sameSite=lax${process.env.NODE_ENV === "production" ? "; secure" : ""}`;
  } catch (error) {
    console.error("Error setting client anonymous ID:", error);
  }
}

/**
 * Clear all tracking cookies on the client
 */
export function clearClientTrackingCookies(): void {
  try {
    document.cookie = `${UTM_COOKIE_NAME}=; path=/; max-age=0`;
    document.cookie = `${VISIT_COOKIE_NAME}=; path=/; max-age=0`;
    document.cookie = `${ANONYMOUS_ID_COOKIE}=; path=/; max-age=0`;
  } catch (error) {
    console.error("Error clearing client tracking cookies:", error);
  }
}
