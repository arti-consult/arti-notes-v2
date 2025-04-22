// src/utils/recordings/recording-service.ts
import { createClient } from "@/utils/supabase/client";
import {
  transcribeAudio,
  TranscriptionResult,
} from "../transcription/gladia-service";

export interface RecordingData {
  title: string;
  duration: number;
  audio_file?: File;
  status: "processing" | "completed" | "error";
  transcription?: TranscriptionResult;
  summary?: string;
  action_items?: any; // JSONB field
  meeting_id?: string;
}

/**
 * Save a new recording to the database
 */
export async function saveRecording(
  data: RecordingData
): Promise<{ id: string } | null> {
  try {
    const supabase = createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting user:", userError);
      throw new Error("User not authenticated");
    }

    console.log("Attempting to save recording with data:", {
      title: data.title,
      duration: data.duration,
      status: data.status,
      hasAudioFile: !!data.audio_file,
      fileSize: data.audio_file?.size,
      fileName: data.audio_file?.name,
      userId: user.id,
      meetingId: data.meeting_id,
    });

    // First, create the recording entry in the database
    const { data: recording, error } = await supabase
      .from("recordings")
      .insert({
        title: data.title,
        duration: data.duration,
        status: data.status,
        user_id: user.id,
        meeting_id: data.meeting_id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    if (!recording?.id) {
      throw new Error("No recording ID returned from database");
    }

    // If there's an audio file, upload it to storage and get transcription
    if (data.audio_file && recording.id) {
      const fileExt = data.audio_file.name.split(".").pop();
      const filePath = `recordings/${recording.id}/${recording.id}.${fileExt}`;

      console.log("Attempting to upload file to storage:", {
        filePath,
        fileSize: data.audio_file.size,
        fileType: data.audio_file.type,
      });

      const { error: uploadError } = await supabase.storage
        .from("audio-recordings")
        .upload(filePath, data.audio_file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", {
          message: uploadError.message,
          name: uploadError.name,
        });
        // Update the recording status to error if upload fails
        await supabase
          .from("recordings")
          .update({ status: "error" })
          .eq("id", recording.id);
        throw uploadError;
      }

      // Get transcription from Gladia
      const transcription = await transcribeAudio(data.audio_file);

      // If there's a transcription, save it
      if (transcription) {
        // Skip transcription save if there's no content
        if (
          !transcription.transcription &&
          (!transcription.segments || transcription.segments.length === 0)
        ) {
          console.log("Skipping transcription save - no content available");

          // Update the recording with just the file path
          const { error: updateRecordingError } = await supabase
            .from("recordings")
            .update({
              file_path: filePath,
              status: "completed",
            })
            .eq("id", recording.id);

          if (updateRecordingError) {
            console.error("Error updating recording:", updateRecordingError);
            throw updateRecordingError;
          }

          return { id: recording.id };
        }

        const transcriptionData = {
          recording_id: recording.id,
          user_id: user.id,
          status: "processing",
          language: "nb",
          summary_text: transcription.summary || null,
          summary_topics: [],
          action_items: transcription.action_items || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          speaker_count: 1,
          confidence_score:
            transcription.segments && transcription.segments.length > 0
              ? transcription.segments.reduce(
                  (acc, segment) => acc + segment.confidence,
                  0
                ) / transcription.segments.length
              : null,
          content: {
            transcription:
              transcription.transcription || "No transcription available",
            segments: transcription.segments || [],
            metadata: {
              version: "1.0.0",
              language: "nb",
              speaker_count: 1,
              status: "completed",
            },
          },
          api_job_id: null,
          api_recording_id: null,
        };

        console.log("Saving transcription with data:", transcriptionData);

        const { error: transcriptionError } = await supabase
          .from("transcriptions")
          .insert(transcriptionData);

        if (transcriptionError) {
          console.error("Error saving transcription:", transcriptionError);
          throw transcriptionError;
        }

        // Update status to completed after successful save
        const { error: updateError } = await supabase
          .from("transcriptions")
          .update({ status: "completed" })
          .eq("recording_id", recording.id);

        if (updateError) {
          console.error("Error updating transcription status:", updateError);
          throw updateError;
        }

        // Update the recording with the file path
        const { error: updateRecordingError } = await supabase
          .from("recordings")
          .update({
            file_path: filePath,
            status: "completed",
          })
          .eq("id", recording.id);

        if (updateRecordingError) {
          console.error("Error updating recording:", updateRecordingError);
          throw updateRecordingError;
        }
      }
    }

    return { id: recording.id };
  } catch (error) {
    console.error("Error in saveRecording:", error);
    return null;
  }
}

/**
 * Get a recording by ID
 */
export async function getRecordingById(id: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("recordings")
      .select(
        `
        *,
        meetings (
          id,
          title,
          description,
          start_time,
          end_time
        ),
        transcriptions (
          id,
          content,
          summary_text,
          action_items,
          status,
          language
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching recording:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching recording:", error);
    return null;
  }
}

/**
 * Get recordings for a meeting
 */
export async function getMeetingRecordings(meetingId: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("recordings")
      .select(
        `
        *,
        transcriptions (
          id,
          content,
          summary_text,
          action_items,
          status,
          language
        )
      `
      )
      .eq("meeting_id", meetingId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching meeting recordings:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching meeting recordings:", error);
    return null;
  }
}

/**
 * Get a signed URL for a recording file
 */
export async function getRecordingFileUrl(
  filePath: string
): Promise<string | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("audio-recordings")
      .createSignedUrl(filePath, 3600); // URL valid for 1 hour

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Error getting recording file URL:", error);
    return null;
  }
}

/**
 * Create a new meeting in the database
 */
export async function createMeeting(
  title: string,
  description?: string
): Promise<{ id: string } | null> {
  try {
    const supabase = createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting user:", userError);
      throw new Error("User not authenticated");
    }

    // Create the meeting
    const { data: meeting, error } = await supabase
      .from("meetings")
      .insert({
        title,
        description,
        user_id: user.id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }

    return { id: meeting.id };
  } catch (error) {
    console.error("Error in createMeeting:", error);
    return null;
  }
}
