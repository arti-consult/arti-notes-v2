import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getAudioDuration } from "@/lib/audioDuration";
import { uploadRecording } from "@/lib/api";

interface RecordingState {
  isRecording: boolean;
  audioBlob: Blob | null;
  duration: number;
  error: string | null;
  isProcessing: boolean;
  uploadProgress: number;
  transcriptionStatus:
    | "idle"
    | "uploading"
    | "processing"
    | "completed"
    | "error";
}

export function useRecording() {
  const { toast } = useToast();
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    audioBlob: null,
    duration: 0,
    error: null,
    isProcessing: false,
    uploadProgress: 0,
    transcriptionStatus: "idle",
  });

  const recordingStartTime = useRef<number | null>(null);
  const durationRef = useRef<number>(0);
  const isMounted = useRef<boolean>(true);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const audioStream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioAnalyzer = useRef<AnalyserNode | null>(null);
  const durationInterval = useRef<number | undefined>(undefined);
  const audioLevelCheckInterval = useRef<number | undefined>(undefined);

  const startRecording = useCallback(async (stream: MediaStream) => {
    try {
      console.log("Starting recording setup...");

      // Validate stream
      if (!stream || stream.getAudioTracks().length === 0) {
        throw new Error("Ingen lydinngang tilgjengelig");
      }

      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack.enabled || audioTrack.muted) {
        throw new Error("Lydinngang er deaktivert eller dempet");
      }

      // Reset state
      setState((prev) => ({
        ...prev,
        audioBlob: null,
        duration: 0,
        error: null,
        isProcessing: false,
        uploadProgress: 0,
        transcriptionStatus: "idle",
      }));

      // Verify audio track
      if (!stream || stream.getAudioTracks().length === 0) {
        throw new Error("Ingen lydinngang tilgjengelig");
      }

      const track = stream.getAudioTracks()[0];
      if (!track.enabled || track.muted) {
        throw new Error("Lydinngang er deaktivert eller dempet");
      }

      // Get supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : null;

      if (!mimeType) {
        throw new Error(
          "Nettleseren støtter ikke lydopptak. Prøv en annen nettleser."
        );
      }

      console.log("Using MIME type:", mimeType);

      // Create and configure MediaRecorder
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, {
          mimeType,
          audioBitsPerSecond: 128000,
        });
      } catch (error) {
        console.error("MediaRecorder creation failed:", error);
        throw new Error(
          "Kunne ikke starte lydopptak. Sjekk nettleserinnstillingene."
        );
      }

      mediaRecorder.current = recorder;
      audioChunks.current = [];

      // Track if we're receiving data
      let hasReceivedData = false;

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          hasReceivedData = true;
          console.log("Received audio chunk:", event.data.size, "bytes");
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        console.log("Recording stopped, processing chunks...");

        setState((prev) => ({ ...prev, isProcessing: true }));

        if (!hasReceivedData || audioChunks.current.length === 0) {
          console.error("No audio data recorded");
          setState((prev) => ({
            ...prev,
            error: "Ingen lyd ble registrert",
            isProcessing: false,
          }));
          return;
        }

        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        console.log("Audio blob created:", audioBlob.size, "bytes");

        if (audioBlob.size < 1024) {
          // Less than 1KB is probably invalid
          setState((prev) => ({
            ...prev,
            error: "Opptaket er for kort",
            isProcessing: false,
          }));
          return;
        }

        // Get audio duration from blob
        const audioDuration = await getAudioDuration(audioBlob);
        console.log("Audio duration:", audioDuration, "seconds");

        // Calculate final duration
        const finalDuration = Math.max(1, Math.round(audioDuration));
        console.log("Final duration:", finalDuration);

        setState((prev) => ({
          ...prev,
          audioBlob,
          duration: finalDuration,
          isProcessing: false,
        }));
      };

      // Start recording with smaller chunks for better responsiveness
      mediaRecorder.current.start(1000);
      console.log("MediaRecorder started");

      // Reset duration tracking
      recordingStartTime.current = Date.now() / 1000; // Convert to seconds
      durationRef.current = 1; // Start with minimum valid duration

      setState((prev) => ({ ...prev, isRecording: true, error: null }));

      // Update duration every second based on actual elapsed time
      durationInterval.current = window.setInterval(() => {
        const now = Date.now() / 1000;
        const elapsed = Math.floor(now - (recordingStartTime.current || now));
        durationRef.current = Math.max(1, elapsed);
        setState((prev) => ({ ...prev, duration: durationRef.current }));
      }, 1000);
    } catch (error) {
      console.error("Recording error:", error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Kunne ikke starte opptak. Sjekk mikrofontilgang.",
        isProcessing: false,
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log("Stopping recording...");
    try {
      if (
        !mediaRecorder.current ||
        mediaRecorder.current.state === "inactive"
      ) {
        console.log("MediaRecorder already stopped");
        return;
      }

      // Calculate final duration
      const finalDuration = Math.max(1, durationRef.current);
      console.log("Final duration:", finalDuration);

      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === "recording"
      ) {
        mediaRecorder.current.stop();
        console.log("MediaRecorder stopped");
      }

      // Update state with final duration
      setState((prev) => ({
        ...prev,
        isRecording: false,
        duration: finalDuration,
      }));

      // Then stop all tracks in the stream
      if (audioStream.current) {
        audioStream.current.getTracks().forEach((track) => track.stop());
        audioStream.current = null;
        console.log("Audio tracks stopped");
      }

      // Clean up audio context and analyzer
      if (audioAnalyzer.current) {
        audioAnalyzer.current.disconnect();
        audioAnalyzer.current = null;
      }

      if (audioContext.current && audioContext.current.state !== "closed") {
        audioContext.current.close().catch(console.warn);
        audioContext.current = null;
      }

      // Clear intervals
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = undefined;
      }

      if (audioLevelCheckInterval.current) {
        clearInterval(audioLevelCheckInterval.current);
        audioLevelCheckInterval.current = undefined;
      }

      recordingStartTime.current = null;
    } catch (error) {
      console.error("Error stopping recording:", error);
      // Try to clean up even if there's an error
      try {
        if (audioStream.current) {
          audioStream.current.getTracks().forEach((track) => track.stop());
          audioStream.current = null;
        }
        if (audioContext.current && audioContext.current.state !== "closed") {
          audioContext.current.close().catch(console.warn);
          audioContext.current = null;
        }
      } catch (cleanupError) {
        console.warn("Error during cleanup:", cleanupError);
      }

      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Kunne ikke stoppe opptaket",
        isRecording: false,
      }));
      throw error; // Re-throw to allow parent components to handle the error
    }
  }, []);

  const resetRecording = useCallback(() => {
    try {
      // Clear interval
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = undefined;
        console.debug("Duration interval cleared");
      }

      // Stop MediaRecorder
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
        console.debug("MediaRecorder stopped");
      }
      mediaRecorder.current = null;

      // Stop audio stream
      if (audioStream.current) {
        audioStream.current.getTracks().forEach((track) => track.stop());
        audioStream.current = null;
        console.debug("Audio tracks stopped");
      }

      // Reset state
      setState({
        isRecording: false,
        audioBlob: null,
        duration: 1,
        error: null,
        isProcessing: false,
        uploadProgress: 0,
        transcriptionStatus: "idle",
      });

      // Clear audio chunks
      audioChunks.current = [];
      recordingStartTime.current = null;
      console.debug("Recording reset completed");
    } catch (error) {
      console.error("Error resetting recording:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Kunne ikke tilbakestille opptaket",
      });
    }
  }, [toast]);

  const cleanup = useCallback(() => {
    try {
      // Stop MediaRecorder if active
      if (mediaRecorder.current) {
        if (mediaRecorder.current.state !== "inactive") {
          mediaRecorder.current.stop();
        }
        mediaRecorder.current = null;
      }

      // Stop audio stream
      if (audioStream.current) {
        audioStream.current.getTracks().forEach((track) => track.stop());
        audioStream.current = null;
      }

      // Clean up audio context
      if (audioContext.current) {
        if (audioContext.current.state !== "closed") {
          audioContext.current.close().catch(console.warn);
        }
        audioContext.current = null;
      }

      // Clear intervals
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = undefined;
      }

      if (audioLevelCheckInterval.current) {
        clearInterval(audioLevelCheckInterval.current);
        audioLevelCheckInterval.current = undefined;
      }

      // Reset state
      setState({
        isRecording: false,
        audioBlob: null,
        duration: 1,
        error: null,
        isProcessing: false,
        uploadProgress: 0,
        transcriptionStatus: "idle",
      });

      // Clear audio chunks
      audioChunks.current = [];
      recordingStartTime.current = null;
      console.debug("Recording cleanup completed");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
  /*
  const checkAudioLevel = async (stream: MediaStream) => {
    try {
      // Validate stream
      const track = stream.getAudioTracks()[0];
      if (!track || !track.enabled) {
        return true; // Consider disabled track as muted
      }

      if (!audioContext.current || audioContext.current.state === "closed") {
        audioContext.current = new AudioContext();
      }

      const source = audioContext.current.createMediaStreamSource(stream);
      const analyzer = audioContext.current.createAnalyser();
      analyzer.fftSize = 1024; // Redusert for bedre ytelse
      analyzer.smoothingTimeConstant = 0.3; // Raskere respons
      analyzer.minDecibels = -70; // Mer følsom for lave lyder
      analyzer.maxDecibels = -30; // Unngå overstyring
      source.connect(analyzer);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      return new Promise<boolean>((resolve) => {
        const sampleBuffer: number[] = [];
        const bufferSize = 10;
        let totalSamples = 0;

        const checkLevel = () => {
          if (!isMounted.current) {
            resolve(false);
            return;
          }

          analyzer.getByteFrequencyData(dataArray);
          // Beregn RMS-verdi for mer nøyaktig lydnivå
          const rms = Math.sqrt(
            dataArray.reduce((acc, val) => acc + val * val, 0) /
              dataArray.length
          );

          sampleBuffer.push(rms);
          if (sampleBuffer.length > bufferSize) {
            sampleBuffer.shift();
          }

          totalSamples++;

          // Vent på nok samples før vi tar en beslutning
          if (totalSamples >= 15) {
            clearInterval(audioLevelCheckInterval.current);

            // Beregn gjennomsnittlig RMS
            const avgRms =
              sampleBuffer.reduce((a, b) => a + b, 0) / sampleBuffer.length;

            // Bruk en adaptiv terskel
            const threshold = 2.0; // Justert terskel basert på testing
            const isMuted = avgRms < threshold;

            console.log("Audio level check:", {
              avgRms,
              threshold,
              isMuted,
              samples: totalSamples,
            });

            resolve(isMuted);
          }
        };

        // Kjør sjekk oftere for raskere respons
        audioLevelCheckInterval.current = window.setInterval(checkLevel, 33);
      });
    } catch (error) {
      console.error("Error checking audio level:", error);
      return false;
    }
  };
*/
  const handleUpload = async (
    title: string,
    folderId: string | null = null,
    participants: Array<{ name: string; email?: string }> = [],
    onProgress?: (progress: number) => void
  ) => {
    if (!state.audioBlob || state.duration < 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ugyldig opptak. Sjekk at opptaket er fullført.",
      });
      return;
    }

    // Get actual duration from audio blob
    let audioDuration = 0;
    try {
      audioDuration = await getAudioDuration(state.audioBlob);
      console.log("Got audio duration:", audioDuration);

      // Validate duration
      if (!Number.isFinite(audioDuration) || audioDuration <= 0) {
        console.warn("Invalid duration, using tracked duration");
        audioDuration = Math.max(1, Math.round(state.duration));
      }
    } catch (error) {
      console.warn("Could not get audio duration:", error);
      // Fall back to tracked duration
      audioDuration = state.duration;
    }
    try {
      setState((prev) => ({
        ...prev,
        transcriptionStatus: "uploading",
      }));

      // Create File object from Blob
      const file = new File([state.audioBlob], `${title}.webm`, {
        type: state.audioBlob.type,
      });

      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        duration: audioDuration,
      });

      // Upload recording
      const recording = await uploadRecording({
        file,
        title,
        folderId,
        participants,
        duration: Math.max(1, state.duration),
        onProgress,
      });

      setState((prev) => ({
        ...prev,
        transcriptionStatus: "processing",
      }));

      return recording;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Kunne ikke laste opp opptaket",
      });
      setState((prev) => ({
        ...prev,
        transcriptionStatus: "error",
        error:
          error instanceof Error
            ? error.message
            : "Kunne ikke laste opp opptaket",
      }));
      throw error;
    }
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    handleUpload,
  };
}
