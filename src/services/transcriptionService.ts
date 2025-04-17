interface TranscriptionResult {
  status: string;
  transcription: string;
  language: string;
  audio_duration_seconds: number;
  processing_time_seconds: number;
}

interface TranscriptionResponse {
  status: "processing" | "completed" | "failed";
  progress?: number;
  result?: TranscriptionResult;
  error?: string;
}

export async function startTranscription(recordingId: string): Promise<void> {
  try {
    console.log("Starting transcription for recording:", recordingId);

    // Get auth session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Ingen gyldig påloggingssesjon");
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/start-transcription`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordingId }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      throw new Error(errorData.error || "Kunne ikke starte transkribering");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Ugyldig respons fra transkriberingsserver");
    }

    console.log("Transcription started successfully");
  } catch (error) {
    console.error("Error starting transcription:", error);
    throw error;
  }
}

export async function checkTranscriptionStatus(
  recordingId: string
): Promise<TranscriptionResponse> {
  try {
    console.log("Checking transcription status for recording:", recordingId);

    // Get auth session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Ingen gyldig påloggingssesjon");
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/check-transcription`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordingId }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      throw new Error(
        errorData.error || "Kunne ikke sjekke transkriberingsstatus"
      );
    }

    const data = await response.json();

    // Map response to our format
    const result: TranscriptionResponse = data;

    console.log("Mapped transcription status:", result);

    return result;
  } catch (error) {
    console.error("Error checking transcription status:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Kunne ikke sjekke transkriberingsstatus"
    );
  }
}
