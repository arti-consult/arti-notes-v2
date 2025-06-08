"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Types
interface OnboardingState {
  step: number;
  userType: "individual" | "company" | null;
  teamSize: "solo" | "small" | "medium" | "large" | null;
  referralSource: string | null;
  audioPurpose: string | null;
  paymentCompleted: boolean;
  micPermission: boolean | null;
}

type OnboardingAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_USER_TYPE"; payload: "individual" | "company" }
  | { type: "SET_TEAM_SIZE"; payload: "solo" | "small" | "medium" | "large" }
  | { type: "SET_REFERRAL_SOURCE"; payload: string }
  | { type: "SET_AUDIO_PURPOSE"; payload: string }
  | { type: "SET_PAYMENT_COMPLETED"; payload: boolean }
  | { type: "SET_MIC_PERMISSION"; payload: boolean }
  | { type: "RESET" };

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  submitOnboarding: (userId: string) => Promise<void>;
  requestMicPermission: () => Promise<void>;
}

// Initial state
const initialState: OnboardingState = {
  step: 1,
  userType: null,
  teamSize: null,
  referralSource: null,
  audioPurpose: null,
  paymentCompleted: false,
  micPermission: null,
};

// Reducer
function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 7) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_USER_TYPE":
      return { ...state, userType: action.payload };
    case "SET_TEAM_SIZE":
      return { ...state, teamSize: action.payload };
    case "SET_REFERRAL_SOURCE":
      return { ...state, referralSource: action.payload };
    case "SET_AUDIO_PURPOSE":
      return { ...state, audioPurpose: action.payload };
    case "SET_PAYMENT_COMPLETED":
      return { ...state, paymentCompleted: action.payload };
    case "SET_MIC_PERMISSION":
      return { ...state, micPermission: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Context
const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

// Provider component
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const submitOnboarding = async (userId: string): Promise<void> => {
    try {
      // Create FormData with onboarding information
      const formData = new FormData();
      formData.append("userType", state.userType || "");
      formData.append("teamSize", state.teamSize || "");
      formData.append("referralSource", state.referralSource || "");
      formData.append("audioPurpose", state.audioPurpose || "");
      formData.append("paymentCompleted", state.paymentCompleted.toString());
      formData.append(
        "micPermission",
        (state.micPermission || false).toString()
      );

      // Import the server action dynamically to avoid SSR issues
      const { completeOnboarding } = await import(
        "../app/(auth)/onboarding/actions"
      );

      // Call the server action
      const result = await completeOnboarding(formData);

      // Handle any errors returned from the server action
      if (result && "error" in result) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      throw error;
    }
  };

  const requestMicPermission = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach((track) => track.stop());
      dispatch({ type: "SET_MIC_PERMISSION", payload: true });
    } catch (error) {
      console.error("Microphone permission denied:", error);
      dispatch({ type: "SET_MIC_PERMISSION", payload: false });
      throw error;
    }
  };

  const value: OnboardingContextType = {
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
}

// Hook to use the context
export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
