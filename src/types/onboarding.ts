export interface OnboardingState {
  step: number;
  userType: "individual" | "company" | null;
  teamSize: "solo" | "small" | "medium" | "large" | null;
  referralSource: string | null;
  audioPurpose: string | null;
  micPermission: boolean | null;
}

export type OnboardingAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_USER_TYPE"; payload: "individual" | "company" }
  | { type: "SET_TEAM_SIZE"; payload: "solo" | "small" | "medium" | "large" }
  | { type: "SET_REFERRAL_SOURCE"; payload: string }
  | { type: "SET_AUDIO_PURPOSE"; payload: string }
  | { type: "SET_MIC_PERMISSION"; payload: boolean }
  | { type: "RESET" };

export interface OnboardingFormData {
  userId: string;
  userType: "individual" | "company";
  teamSize: "solo" | "small" | "medium" | "large";
  referralSource: string;
  audioPurpose: string;
  micPermission: boolean;
}
