"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { captureUTMParameters, captureVisitData } from "@/utils/tracking/utm";
import { createClient } from "@/utils/supabase/client";
import {
  getClientAnonymousId,
  setClientAnonymousId,
  setClientUTMData,
  setClientVisitData,
} from "@/utils/tracking/client";

const ANONYMOUS_ID_COOKIE = "arti_anonymous_id";
const COOKIE_EXPIRY = 365; // 1 year

export default function TrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Generate or retrieve anonymous ID for the visitor
  useEffect(() => {
    const getOrCreateAnonymousId = async () => {
      try {
        let anonymousId = getClientAnonymousId();

        if (!anonymousId) {
          anonymousId = uuidv4();
          setClientAnonymousId(anonymousId);
        }
      } catch (error) {
        console.error("Error handling anonymous ID:", error);
      }
    };

    getOrCreateAnonymousId();
  }, []);

  // Capture UTM parameters and visit data
  useEffect(() => {
    const captureTrackingData = async () => {
      try {
        const anonymousId = getClientAnonymousId();
        if (!anonymousId) return;

        // Capture UTM parameters
        const utmParams = await captureUTMParameters(searchParams.toString());
        if (Object.keys(utmParams).length > 0) {
          setClientUTMData(utmParams);
        }

        // Capture visit data
        await captureVisitData();

        // Save tracking data to database
        await saveTrackingData(anonymousId, utmParams);
      } catch (error) {
        console.error("Error capturing tracking data:", error);
      }
    };

    captureTrackingData();
  }, [pathname, searchParams]);

  // Function to save tracking data to the database
  const saveTrackingData = async (anonymousId: string, utmParams: any) => {
    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Build tracking data object
      const trackingData: Record<string, any> = {
        anonymous_id: anonymousId,
        user_id: user?.id,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        referrer: document.referrer || null,
        landing_page: window.location.href,
        first_visit: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(trackingData).forEach((key) => {
        if (trackingData[key] === undefined) {
          delete trackingData[key];
        }
      });

      // Save to database
      const { error } = await supabase
        .from("tracking_data")
        .insert(trackingData);

      if (error && !error.message.includes("duplicate")) {
        console.error("Error saving tracking data:", error);
      }
    } catch (error) {
      console.error("Error saving tracking data:", error);
    }
  };

  return <>{children}</>;
}
