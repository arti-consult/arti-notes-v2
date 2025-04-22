import { createClient } from "@/utils/supabase/client";

const GLADIA_API_KEY = process.env.NEXT_PUBLIC_GLADIA_API_KEY;
const GLADIA_API_URL = "https://api.gladia.io/audio/text/audio-transcription/";

interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

export interface TranscriptionResult {
  transcription: string;
  segments: TranscriptionSegment[];
  summary?: string;
  action_items?: string[];
}

export async function transcribeAudio(
  audioFile: File
): Promise<TranscriptionResult | null> {
  try {
    if (!GLADIA_API_KEY) {
      throw new Error("Gladia API key not found");
    }

    // First, upload the file to get a URL
    const supabase = createClient();
    const fileExt = audioFile.name.split(".").pop();
    const fileName = `temp_${Date.now()}.${fileExt}`;
    const filePath = `transcriptions/${fileName}`;

    console.log("Uploading file to Supabase storage:", {
      fileName,
      filePath,
      fileSize: audioFile.size,
      fileType: audioFile.type,
    });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("audio-recordings")
      .upload(filePath, audioFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw uploadError;
    }

    console.log("File uploaded successfully:", uploadData);

    // Get a signed URL that's valid for 1 hour
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("audio-recordings")
        .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (signedUrlError) {
      console.error("Error creating signed URL:", signedUrlError);
      throw signedUrlError;
    }

    if (!signedUrlData?.signedUrl) {
      throw new Error("Failed to generate signed URL");
    }

    const signedUrl = signedUrlData.signedUrl;
    console.log("Generated signed URL:", signedUrl);

    // Create form data for Gladia API
    const formData = new FormData();
    formData.append("audio_url", signedUrl);
    formData.append("language", "en");
    formData.append("model_size", "large");
    formData.append(
      "transcription_format",
      JSON.stringify({
        output_format: "json",
        diarization: true,
        summarization: true,
        action_items: true,
      })
    );

    console.log("Calling Gladia API with signed URL");

    // Call Gladia API
    const response = await fetch(GLADIA_API_URL, {
      method: "POST",
      headers: {
        "x-gladia-key": GLADIA_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gladia API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `Gladia API error: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    console.log("Gladia API response:", result);

    // Clean up the temporary file
    await supabase.storage.from("audio-recordings").remove([filePath]);

    if (!result.prediction || !Array.isArray(result.prediction)) {
      throw new Error("Invalid response format from Gladia API");
    }

    // Format the transcription segments
    const segments = result.prediction.map((segment: any) => ({
      start: segment.time_begin,
      end: segment.time_end,
      text: segment.transcription,
      confidence: segment.confidence,
    }));

    // Combine all transcriptions into a single text
    const fullTranscription = segments
      .map((segment: TranscriptionSegment) => segment.text)
      .join(" ");

    return {
      transcription: fullTranscription,
      segments,
      summary: result.summary,
      action_items: result.action_items,
    };
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    return null;
  }
}
