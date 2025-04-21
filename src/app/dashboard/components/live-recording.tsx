"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Download, X, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AudioVisualizer } from "./audio-visualizer";
import { DeleteRecordingDialog } from "./delete-recording-dialog";
import { Separator } from "@/components/ui/separator";

interface LiveRecordingProps {
  onClose?: () => void;
  onComplete?: (audioBlob: Blob) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

export function LiveRecording({
  onClose,
  onComplete,
  onRecordingStateChange,
}: LiveRecordingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0));
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
        cleanupAudioResources();
        setAudioData(new Array(32).fill(0));
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
    const a = document.createElement("a");
    a.href = audioURL;
    a.download = `recording-${new Date().toISOString()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleComplete = () => {
    if (audioURL) {
      fetch(audioURL)
        .then((response) => response.blob())
        .then((blob) => {
          onComplete?.(blob);
          onClose?.();
        });
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
    };
  }, []);

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
              <audio
                ref={audioRef}
                controls
                src={audioURL}
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Complete
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
          setShowDeleteDialog(false);
          onClose?.();
        }}
      />
    </>
  );
}
