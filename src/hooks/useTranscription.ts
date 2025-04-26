import { useState, useCallback } from "react";

interface TranscriptionState {
  status: "idle" | "processing" | "completed" | "failed";
  transcription: string[];
  error: string | null;
}

export function useTranscription() {
  const [state, setState] = useState<TranscriptionState>({
    status: "idle",
    transcription: [],
    error: null,
  });

  const startTranscription = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      status: "processing",
      error: null,
    }));

    try {
      // Simulate transcription process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setState({
        status: "completed",
        transcription: ["Dette er en simulert transkripsjon for testing."],
        error: null,
      });
    } catch (error) {
      console.error("Transcription error:", error);
      setState((prev) => ({
        ...prev,
        status: "failed",
        error: "Kunne ikke transkribere opptaket",
      }));
    }
  }, []);

  return {
    ...state,
    startTranscription,
  };
}
