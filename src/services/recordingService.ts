import { getAudioDuration } from "@/lib/audioDuration";

export interface Recording {
  id: string;
  title: string;
  duration: number;
  status: string;
  transcription_id?: string;
}

export async function uploadRecording(
  file: File,
  title: string,
  folderId: string | null = null,
  participants: Array<{ name: string; email?: string }> = [],
  trackedDuration: number = 1,
  onProgress?: (progress: number) => void
): Promise<Recording> {
  try {
    if (!file) {
      throw new Error("Ingen lydfil tilgjengelig");
    }

    // Ensure we have a valid tracked duration
    const initialDuration = Math.max(1, Math.round(trackedDuration));

    console.log("Starting recording upload:", {
      title,
      fileSize: file?.size,
      fileType: file?.type,
      name: file?.name,
      initialDuration,
    });

    // Get accurate duration from file
    const duration = await getAudioDuration(file, {
      fallbackDuration: initialDuration,
      timeout: 5000,
    });

    // Calculate final duration
    const finalDuration = Math.max(1, Math.round(duration));
    console.log("Final duration:", finalDuration);

    // Validate file type
    const allowedTypes = transcriptionConfig.audio.allowedTypes;
    if (!file || !allowedTypes.includes(file.type)) {
      throw new Error(
        `Filformatet støttes ikke. Støttede formater: ${allowedTypes.join(
          ", "
        )}`
      );
    }

    // Get user session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Du må være logget inn for å laste opp opptak");
    }

    // Create recording record first
    const { data: recording, error: recordingError } = await supabase
      .from("recordings")
      .insert({
        title: title.trim(),
        folder_id: folderId,
        status: "processing",
        user_id: user.id,
        duration: finalDuration,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (recordingError) {
      console.error("Database error:", recordingError);
      throw new Error("Kunne ikke opprette opptak i databasen");
    }

    console.log("Created recording record:", recording);

    // Upload file to Supabase Storage with retry logic
    const maxRetries = 3;
    let uploadError: Error | null = null;
    let lastAttemptError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Keep original file extension
        const extension = file.name.split(".").pop() || "webm";
        const filePath = `${user.id}/${recording.id}.${extension}`;
        console.log("Uploading file to path:", filePath);

        const { error } = await supabase.storage
          .from("recordings")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
            onUploadProgress: ({ progress }) => {
              onProgress?.(Math.round(progress * 100));
            },
          });

        if (!error) {
          uploadError = null;
          break;
        }

        uploadError = error;
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
        lastAttemptError = error;
      } catch (error) {
        uploadError = error as Error;
        lastAttemptError = error as Error;
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }

    if (uploadError) {
      console.error("Upload failed after retries:", uploadError);
      throw new Error(
        lastAttemptError?.message ||
          "Kunne ikke laste opp filen etter flere forsøk"
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage
      .from("recordings")
      .getPublicUrl(`${user.id}/${recording.id}.webm`);

    if (urlError || !publicUrl) {
      throw new Error("Could not get file URL");
    }

    // Update recording with file URL and metadata
    const { error: updateError } = await supabase
      .from("recordings")
      .update({
        file_url: publicUrl,
        file_size: file.size,
        updated_at: new Date().toISOString(),
      })
      .eq("id", recording.id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error("Could not update recording");
    }
    console.log("Updated recording with file URL:", publicUrl);

    // Add participants if any
    if (participants.length > 0) {
      const { error: participantsError } = await supabase
        .from("recording_participants")
        .insert(
          participants.map((p) => ({
            recording_id: recording.id,
            name: p.name.trim(),
            email: p.email?.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }))
        );

      if (participantsError) {
        console.error("Error adding participants:", participantsError);
      }
    }

    // Start transcription process
    try {
      const response = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/start-transcription`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              (
                await supabase.auth.getSession()
              ).data.session?.access_token
            }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recordingId: recording.id,
          }),
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

      const responseData = await response.json();

      if (!responseData.jobId || !responseData.apiRecordingId) {
        throw new Error("Ingen transkripsjons-ID mottatt");
      }

      console.log("Transcription started successfully");

      // Update recording with transcription info
      const { error: updateError } = await supabase
        .from("recordings")
        .update({
          status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", recording.id);

      if (updateError) {
        throw new Error("Kunne ikke oppdatere opptaksstatus");
      }

      // Create transcription record
      const { error: transcriptionError } = await supabase
        .from("transcriptions")
        .upsert(
          {
            recording_id: recording.id,
            user_id: user.id,
            status: "processing",
            api_job_id: responseData.jobId,
            api_recording_id: responseData.apiRecordingId,
            content: {
              text: "",
              segments: [],
              language: "nb",
              duration: finalDuration,
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "recording_id",
          }
        );

      if (transcriptionError) {
        throw new Error("Kunne ikke opprette transkripsjonsoppføring");
      }

      return {
        ...recording,
        api_job_id: responseData.jobId,
        api_recording_id: responseData.apiRecordingId,
      };
    } catch (error) {
      console.error("Error starting transcription:", error);
      await updateRecordingStatus(recording.id, "error");
      throw new Error(
        error instanceof Error
          ? error.message
          : "Kunne ikke starte transkribering"
      );
    }

    return recording;
  } catch (error) {
    console.error("Upload error:", error);
    throw error instanceof Error
      ? error
      : new Error("Unknown error during upload");
  }
}

export async function updateRecordingStatus(
  recordingId: string,
  status: "processing" | "completed" | "error",
  metadata?: {
    duration?: number;
    error?: string;
  }
) {
  try {
    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (metadata?.duration) {
      updates.duration = metadata.duration;
    }

    if (metadata?.error) {
      updates.error_message = metadata.error;
    }

    const { error } = await supabase
      .from("recordings")
      .update(updates)
      .eq("id", recordingId);

    if (error) {
      console.error("Status update error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Kunne ikke laste opp opptaket"
      );
    }
  } catch (error) {
    console.error("Error updating recording status:", error);
    if (error instanceof Error) {
      if (error.message.includes("duration")) {
        throw new Error("Kunne ikke bestemme opptakets varighet. Prøv igjen.");
      }
      throw error;
    }
    throw new Error("En ukjent feil oppstod under opplasting");
  }
}
