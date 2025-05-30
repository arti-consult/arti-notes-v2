"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Download, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AudioVisualizer } from "./audio-visualizer";
import { DeleteRecordingDialog } from "./delete-recording-dialog";
import { saveRecording } from "@/utils/recordings/recording-service";
import { createMeeting } from "@/utils/meetings/meeting-service";

interface LiveRecordingProps {
  onClose?: () => void;
  onComplete?: (recordingId: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

export function LiveRecording({
  onClose,
  onComplete,
  onRecordingStateChange,
}: LiveRecordingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0));
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cleanupAudioResources = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch (error) {
        console.warn("Error closing AudioContext:", error);
      }
      audioContextRef.current = null;
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      setShowAnimation(true);
      setRecordingDuration(0);
      setStartTime(new Date().toISOString());
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      cleanupAudioResources();

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      analyserRef.current.smoothingTimeConstant = 0.7;
      source.connect(analyserRef.current);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        cleanupAudioResources();
        setAudioData(new Array(32).fill(0));

        // Set a default recording title based on date and time
        const now = new Date();
        const defaultTitle = `Recording ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        setRecordingTitle(defaultTitle);
      };

      setTimeout(() => {
        setShowAnimation(false);
        mediaRecorder.start();
        setIsRecording(true);
        onRecordingStateChange?.(true);
        startAudioVisualization();
        // Start duration counter
        durationIntervalRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setShowAnimation(false);
      cleanupAudioResources();
      alert("Failed to access your microphone. Please check permissions.");
    }
  };

  const startAudioVisualization = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualization = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const normalizedData = Array.from(dataArray).map((value) => value / 255);
      setAudioData(normalizedData);

      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      onRecordingStateChange?.(false);
      cleanupAudioResources();
    }
  };

  const handleDownload = () => {
    if (!audioURL) return;

    const a = document.createElement("a");
    a.href = audioURL;
    a.download = `${recordingTitle.trim() || "recording"}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveRecording = async () => {
    if (!audioBlob || !startTime) return;

    try {
      setIsSaving(true);

      const endTime = new Date().toISOString();

      // Create a meeting first
      const meeting = await createMeeting(
        recordingTitle.trim() || `Meeting ${new Date().toISOString()}`,
        "Meeting created from recording",
        "live",
        startTime,
        endTime
      );

      if (!meeting) {
        throw new Error("Failed to create meeting");
      }

      // Format the title to be more readable
      const formattedTitle = recordingTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Create a File object from the blob
      const audioFile = new File([audioBlob], `${formattedTitle}.webm`, {
        type: "audio/webm",
      });

      // Save the recording with the meeting ID
      const result = await saveRecording({
        title: recordingTitle.trim() || `Recording ${new Date().toISOString()}`,
        duration: recordingDuration,
        audio_file: audioFile,
        status: "processing",
        meeting_id: meeting.id,
      });

      if (!result) {
        throw new Error("Failed to save recording");
      }

      alert("Your recording has been saved successfully.");

      if (onComplete) {
        onComplete(meeting.id);
      }

      onClose?.();
    } catch (error) {
      console.error("Error saving recording:", error);
      alert(
        error instanceof Error
          ? error.message
          : "There was an error saving your recording. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      cleanupAudioResources();

      // Clean up object URLs
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Live Recording
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 text-sm">
                <span className="animate-pulse text-red-500">●</span>
                {formatDuration(recordingDuration)}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            {!isRecording && !audioURL && (
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}
            {isRecording && (
              <Button
                onClick={stopRecording}
                className="bg-gray-500 hover:bg-gray-600"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </div>

          {showAnimation && (
            <div className="flex justify-center">
              <div className="animate-pulse text-red-500 text-lg font-medium">
                Starting recording...
              </div>
            </div>
          )}

          {isRecording && (
            <div className="flex flex-col items-center gap-2">
              <AudioVisualizer audioData={audioData} />
              <div className="text-sm text-muted-foreground">
                Recording in progress...
              </div>
            </div>
          )}

          {audioURL && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Recording Title</Label>
                <Input
                  id="title"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder="Enter a title for your recording"
                />
              </div>

              <audio
                ref={audioRef}
                controls
                src={audioURL}
                className="w-full"
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveRecording}
                  className="bg-violet-600 hover:bg-violet-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4 text-white" />
                      <span className="text-white">Save Recording</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteRecordingDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          setAudioURL("");
          setAudioBlob(null);
          setShowDeleteDialog(false);
          onClose?.();
        }}
      />
    </>
  );
}
