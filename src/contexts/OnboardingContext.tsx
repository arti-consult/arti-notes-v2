"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  OnboardingState,
  OnboardingAction,
  OnboardingFormData,
} from "@/types/onboarding";
import { createClient } from "@/utils/supabase/client";
import { UTMParams } from "@/utils/tracking/utm";

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  submitOnboarding: (userId: string) => Promise<void>;
  requestMicPermission: () => Promise<boolean>;
}

const initialState: OnboardingState = {
  step: 1,
  userType: null,
  teamSize: null,
  referralSource: null,
  audioPurpose: null,
  micPermission: null,
  paymentCompleted: null,
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const onboardingReducer = (
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState => {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: state.step + 1 };
    case "PREV_STEP":
      return { ...state, step: Math.max(1, state.step - 1) };
    case "SET_USER_TYPE":
      return { ...state, userType: action.payload };
    case "SET_TEAM_SIZE":
      return { ...state, teamSize: action.payload };
    case "SET_REFERRAL_SOURCE":
      return { ...state, referralSource: action.payload };
    case "SET_AUDIO_PURPOSE":
      return { ...state, audioPurpose: action.payload };
    case "SET_MIC_PERMISSION":
      return { ...state, micPermission: action.payload };
    case "SET_PAYMENT_COMPLETED":
      return { ...state, paymentCompleted: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const supabase = createClient();

  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser does not support media devices");
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Stop all tracks immediately after permission is granted
      stream.getTracks().forEach((track) => track.stop());

      dispatch({ type: "SET_MIC_PERMISSION", payload: true });
      return true;
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      dispatch({ type: "SET_MIC_PERMISSION", payload: false });
      return false;
    }
  }, []);

  const submitOnboarding = useCallback(
    async (userId: string): Promise<void> => {
      try {
        if (
          !state.userType ||
          !state.teamSize ||
          !state.referralSource ||
          !state.audioPurpose ||
          !state.paymentCompleted
        ) {
          throw new Error("Missing required onboarding information");
        }

        const onboardingData: OnboardingFormData = {
          userId,
          userType: state.userType,
          teamSize: state.teamSize,
          referralSource: state.referralSource,
          audioPurpose: state.audioPurpose,
          micPermission: state.micPermission ?? false,
          paymentCompleted: state.paymentCompleted,
        };

        // Get UTM data from cookies if available
        let utmData: UTMParams = {};
        try {
          if (typeof window !== "undefined") {
            // Dynamically import to avoid SSR issues
            const { getAllTrackingData } = await import("@/utils/tracking/utm");
            utmData = await getAllTrackingData();
          }
        } catch (err) {
          console.error("Error getting UTM data:", err);
        }

        // Save onboarding data to Supabase
        const { data, error } = await supabase
          .from("user_onboarding")
          .upsert({
            user_id: userId,
            user_type: onboardingData.userType,
            team_size: onboardingData.teamSize,
            referral_source: onboardingData.referralSource,
            audio_purpose: onboardingData.audioPurpose,
            mic_permission: onboardingData.micPermission,
            payment_completed: onboardingData.paymentCompleted,
            utm_source: utmData.utm_source || null,
            utm_medium: utmData.utm_medium || null,
            utm_campaign: utmData.utm_campaign || null,
            referrer: utmData.referrer || null,
            completed_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (error) throw error;

        if (data?.id) {
          // Link tracking data to onboarding data
          try {
            // Dynamically import server utility
            const { saveUTMDataDuringOnboarding } = await import(
              "@/utils/tracking/server"
            );
            await saveUTMDataDuringOnboarding(userId, data.id);
          } catch (err) {
            console.error("Error linking tracking data:", err);
            // Non-fatal error, continue
          }
        }

        // Reset the state after successful submission
        dispatch({ type: "RESET" });
      } catch (error) {
        console.error("Error submitting onboarding data:", error);
        throw error;
      }
    },
    [state, supabase]
  );

  const value = {
    state,
    dispatch,
    submitOnboarding,
    requestMicPermission,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
