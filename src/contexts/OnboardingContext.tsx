"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Types - simplified without payment fields
interface OnboardingState {
  step: number;
  userType: "individual" | "company" | null;
  teamSize: "solo" | "small" | "medium" | "large" | null;
  referralSource: string | null;
  audioPurpose: string | null;
}

type OnboardingAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_USER_TYPE"; payload: "individual" | "company" }
  | { type: "SET_TEAM_SIZE"; payload: "solo" | "small" | "medium" | "large" }
  | { type: "SET_REFERRAL_SOURCE"; payload: string }
  | { type: "SET_AUDIO_PURPOSE"; payload: string }
  | { type: "RESET" };

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  submitOnboarding: (userId: string) => Promise<void>;
}

// Initial state - simplified
const initialState: OnboardingState = {
  step: 1,
  userType: null,
  teamSize: null,
  referralSource: null,
  audioPurpose: null,
};

// Reducer - simplified
function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 5) }; // Changed max to 5
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
      formData.append("paymentCompleted", "true"); // Payment already completed
      formData.append("micPermission", "true"); // Default to true for simplified flow

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

  const value: OnboardingContextType = {
    state,
    dispatch,
    submitOnboarding,
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
