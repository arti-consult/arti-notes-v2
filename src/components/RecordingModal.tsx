import { useState, useRef, useEffect } from "react";
import {
  Mic,
  X,
  Activity,
  Clock,
  AlertCircle,
  UserPlus,
  ChevronDown,
  Trash2,
  RefreshCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRecording } from "@/hooks/useRecording";

import { useAuth } from "@/contexts/AuthContext";
import { useFolders } from "@/contexts/FolderContext";
import { validateAudioFile } from "@/lib/fileValidation";
import FolderSelect from "@/components/FolderSelect";
import { uploadRecording } from "@/services/recordingService";
import { cn } from "@/lib/utils";
import AudioVisualizer from "./AudioVisualizer";
import { toast } from "@/components/ui/toast";

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (recordingId: string) => void;
}

interface Participant {
  id: string;
  name: string;
  email: string;
}

type TranscriptionStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "completed"
  | "error";

const STATUS_MESSAGES = {
  idle: "Klar til opptak",
  uploading: "Laster opp opptak...",
  processing: "Transkriberer opptak...",
  completed: "Transkribering fullført",
  error: "Feil under transkribering",
} as const;

const STATUS_DESCRIPTIONS = {
  uploading: "Opptaket lastes opp til sikker lagring",
  processing: "Opptaket blir analysert og transkribert",
  completed: "Transkriberingen er klar til bruk",
  error: "Det oppstod en feil under transkriberingen. Prøv igjen.",
} as const;

export default function RecordingModal({
  isOpen,
  onClose,
  onComplete,
}: RecordingModalProps) {
  const { user } = useAuth();
  const { folders } = useFolders();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "" });
  const [participantError, setParticipantError] = useState<string | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(
    null
  );
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);
  const [modalStatus, setModalStatus] = useState<TranscriptionStatus>("idle");

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioLevelCheckInterval = useRef<number>();
  const isMounted = useRef(true);

  const {
    isRecording,
    duration,
    error: recordingError,
    audioBlob,
    isProcessing,
    startRecording,
    stopRecording,
    resetRecording,
    handleUpload: handleRecordingUpload,
  } = useRecording();

  // Add polling for transcription status
  useEffect(() => {
    let timeoutId: number;

    const checkStatus = async () => {
      if (!currentRecordingId || modalStatus !== "processing") return;

      try {
        const response = await fetch(
          `${process.env.SUPABASE_URL}/functions/v1/check-transcription`,
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
            body: JSON.stringify({ recordingId: currentRecordingId }),
          }
        );

        if (!response.ok) {
          throw new Error("Kunne ikke sjekke transkriberingsstatus");
        }

        const data = await response.json();

        if (data.status === "completed") {
          setModalStatus("completed");
          if (onComplete) {
            onComplete(currentRecordingId);
          }
          onClose();
        } else if (data.status === "failed") {
          setModalStatus("error");
          setSaveError(data.error || "Transkribering feilet");
          toast.error(data.error || "Transkribering feilet");
        } else {
          // Continue polling
          timeoutId = window.setTimeout(checkStatus, 5000);
        }

        // Update progress
        setUploadProgress(data.progress || 0);
      } catch (error) {
        console.error("Error checking transcription status:", error);
        setModalStatus("error");
        setSaveError(
          error instanceof Error
            ? error.message
            : "Kunne ikke sjekke transkriberingsstatus"
        );
        toast.error("Kunne ikke sjekke transkriberingsstatus");
      }
    };

    if (modalStatus === "processing") {
      checkStatus();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentRecordingId, modalStatus, onComplete, onClose]);

  // Cleanup effect
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!isOpen && isMounted.current) {
      cleanup();
    }
  }, [isOpen]);

  const cleanup = () => {
    if (isRecording) {
      stopRecording().catch(console.error);
    }

    setIsLoading(false);
    setIsSaving(false);
    setSaveError(null);
    setRecordingTitle("");
    setTitleError(null);
    setParticipants([]);
    setNewParticipant({ name: "", email: "" });
    setParticipantError(null);
    setSelectedFolder(null);
    setCurrentRecordingId(null);
    setModalStatus("idle");
    setUploadProgress(0);

    if (audioStream) {
      audioStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.warn("Error stopping audio track:", error);
        }
      });
      setAudioStream(null);
    }

    if (audioLevelCheckInterval.current) {
      clearInterval(audioLevelCheckInterval.current);
      audioLevelCheckInterval.current = undefined;
    }

    if (audioContextRef.current?.state !== "closed") {
      try {
        audioContextRef.current?.close();
      } catch (error) {
        console.warn("Error closing AudioContext:", error);
      }
      audioContextRef.current = null;
    }
  };

  // Check if microphone is muted
  const checkAudioLevel = async (stream: MediaStream) => {
    try {
      // Validate stream and tracks first
      const track = stream.getAudioTracks()[0];
      if (!track || !track.enabled) {
        return true; // Consider disabled track as muted
      }

      // Get track settings to check if it's actually muted
      const settings = track.getSettings();
      if (settings.volume === 0) {
        return true;
      }

      if (
        !audioContextRef.current ||
        audioContextRef.current.state === "closed"
      ) {
        audioContextRef.current = new AudioContext();
      }

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyzer = audioContextRef.current.createAnalyser();
      analyzer.fftSize = 1024;
      analyzer.smoothingTimeConstant = 0.3;
      analyzer.minDecibels = -70;
      analyzer.maxDecibels = -30;
      source.connect(analyzer);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      return new Promise<boolean>((resolve) => {
        const samples: number[] = [];
        const sampleCount = 30; // Samle flere samples for bedre nøyaktighet

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

          samples.push(rms);

          if (samples.length >= sampleCount) {
            clearInterval(audioLevelCheckInterval.current);

            // Beregn gjennomsnittlig RMS
            const avgRms = samples.reduce((a, b) => a + b, 0) / samples.length;

            // Bruk en mer robust terskel
            const threshold = 5.0;
            const isMuted = avgRms < threshold;

            console.log("Audio level check:", {
              avgRms,
              threshold,
              isMuted,
              sampleCount: samples.length,
            });

            resolve(isMuted);
          }
        };

        // Kjør sjekk oftere for bedre nøyaktighet
        audioLevelCheckInterval.current = window.setInterval(checkLevel, 33);
      });
    } catch (error) {
      console.error("Error checking audio level:", error);
      return false;
    }
  };

  // Utility functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "00:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handlers
  const handleAddParticipant = () => {
    setParticipantError(null);

    const { name, email } = newParticipant;
    if (!name.trim()) {
      setParticipantError("Navn er påkrevd");
      return;
    }

    if (email && !validateEmail(email)) {
      setParticipantError("Ugyldig e-postadresse");
      return;
    }

    setParticipants((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
      },
    ]);
    setNewParticipant({ name: "", email: "" });
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStartRecording = async () => {
    if (!recordingTitle.trim()) {
      setTitleError("Vennligst gi opptaket et navn");
      return;
    }
    setTitleError(null);

    try {
      setIsLoading(true);
      setSaveError(null);

      // Check for microphone permission first
      const permission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      if (permission.state === "denied") {
        throw new Error(
          "Mikrofontilgang er blokkert. Gi tilgang i nettleserinnstillingene."
        );
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasAudioInput = devices.some(
        (device) => device.kind === "audioinput"
      );

      if (!hasAudioInput) {
        throw new Error(
          "Ingen mikrofon funnet. Koble til en mikrofon og prøv igjen."
        );
      }

      // Request audio with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          latency: 0,
        },
      });

      // Verify stream is valid
      if (!stream || stream.getAudioTracks().length === 0) {
        throw new Error("Kunne ikke få tilgang til mikrofonen");
      }

      const isMuted = await checkAudioLevel(stream);
      setIsMicrophoneMuted(isMuted);

      if (isMuted && isMounted.current) {
        toast.info(
          "Mikrofonen ser ut til å være dempet. Sjekk mikrofoninnstillingene."
        );
      }

      setAudioStream(stream);
      try {
        await startRecording(stream);
      } catch (recError) {
        // Clean up stream if recording fails
        stream.getTracks().forEach((track) => track.stop());
        throw recError;
      }
    } catch (error) {
      console.error("Error starting recording:", error);

      // Clean up any existing streams
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Kunne ikke starte opptak. Sjekk mikrofontilgang.";

      if (isMounted.current) {
        toast.error(errorMessage);
        setSaveError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleStopRecording = () => {
    if (!user) {
      setSaveError("Bruker ikke logget inn");
      return;
    }

    setIsLoading(true);
    try {
      stopRecording();
      toast.success("Opptak fullført");
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast.error("Kunne ikke stoppe opptaket");
      setSaveError("Kunne ikke stoppe opptaket");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob || !user) {
      setSaveError("Mangler lydopptak eller bruker ikke logget inn");
      toast.error("Mangler lydopptak eller bruker ikke logget inn");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      setModalStatus("uploading");
      setUploadProgress(0);

      const file = new File([audioBlob], `${recordingTitle}.webm`, {
        type: audioBlob.type,
      });

      const recording = await uploadRecording(
        file,
        recordingTitle,
        selectedFolder,
        participants.map((p) => ({
          name: p.name,
          email: p.email,
        })),
        duration,
        setUploadProgress
      );

      if (isMounted.current) {
        setCurrentRecordingId(recording.id);
        setModalStatus("processing");
        toast.success("Opptak lastet opp og transkribering startet");
      }
    } catch (error) {
      console.error("Error saving recording:", error);
      if (isMounted.current) {
        setModalStatus("error");
        const errorMessage =
          error instanceof Error ? error.message : "Kunne ikke lagre opptaket";
        toast.error(errorMessage);
        setSaveError(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setIsSaving(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "p-2 rounded-full",
                  isRecording ? "bg-red-100" : "bg-gray-100",
                  modalStatus === "processing" && "bg-yellow-100",
                  modalStatus === "completed" && "bg-green-100",
                  modalStatus === "error" && "bg-red-100"
                )}
              >
                <Mic
                  className={cn(
                    "h-5 w-5",
                    isRecording ? "text-red-600" : "text-gray-600",
                    modalStatus === "processing" && "text-yellow-600",
                    modalStatus === "completed" && "text-green-600",
                    modalStatus === "error" && "text-red-600"
                  )}
                />
              </div>
              <div>
                <h3 className="font-semibold">
                  {isRecording ? "Opptak pågår" : STATUS_MESSAGES[modalStatus]}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDuration(duration)}</span>
                  {isMicrophoneMuted && (
                    <div className="flex items-center ml-2 text-amber-600">
                      <VolumeX className="h-4 w-4 mr-1" />
                      <span>Mikrofon dempet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isRecording || isSaving}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {(recordingError || saveError) && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{recordingError || saveError}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {!isRecording && !audioBlob && (
            <div className="space-y-6">
              {/* Title input */}
              <div>
                <label
                  htmlFor="recordingTitle"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Navn på opptak
                </label>
                <div className="relative">
                  <input
                    id="recordingTitle"
                    type="text"
                    value={recordingTitle}
                    onChange={(e) => {
                      setRecordingTitle(e.target.value);
                      setTitleError(null);
                    }}
                    placeholder="F.eks. Ukentlig møte"
                    className={cn(
                      "w-full rounded-lg border px-4 py-2 focus:border-violet-500 focus:ring-violet-500",
                      titleError ? "border-red-300" : "border-gray-300"
                    )}
                    disabled={isRecording}
                  />
                  {titleError && (
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {titleError && (
                  <p className="mt-2 text-sm text-red-600">{titleError}</p>
                )}
              </div>

              {/* Folder selector */}
              {folders.length > 0 && (
                <div>
                  <FolderSelect
                    currentFolderId={selectedFolder}
                    onFolderChange={setSelectedFolder}
                    disabled={isRecording || isSaving}
                  />
                </div>
              )}

              {/* Participants section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legg til deltakere (valgfritt)
                </label>

                <div className="space-y-3 mb-4">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-violet-100">
                          <UserPlus className="h-4 w-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {participant.name}
                          </p>
                          {participant.email && (
                            <p className="text-sm text-gray-600">
                              {participant.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newParticipant.name}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Navn"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="email"
                        value={newParticipant.email}
                        onChange={(e) =>
                          setNewParticipant((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="E-post (valgfritt)"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <button
                      onClick={handleAddParticipant}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      <UserPlus className="h-5 w-5" />
                    </button>
                  </div>
                  {participantError && (
                    <p className="text-sm text-red-600">{participantError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recording/Processing UI */}
          <div className="flex flex-col items-center justify-center mt-6">
            {isRecording ? (
              <div className="flex flex-col items-center">
                {audioStream && <AudioVisualizer stream={audioStream} />}
                <p className="text-sm text-gray-500 mt-2">{recordingTitle}</p>
              </div>
            ) : isProcessing || isSaving || modalStatus !== "idle" ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className={cn(
                          "transition-all duration-300",
                          modalStatus === "error"
                            ? "text-red-600"
                            : "text-violet-600"
                        )}
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                        style={{
                          strokeDasharray: 264,
                          strokeDashoffset:
                            264 -
                            ((modalStatus === "uploading"
                              ? uploadProgress
                              : uploadProgress) /
                              100) *
                              264,
                        }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-medium">
                      {modalStatus === "uploading"
                        ? uploadProgress
                        : uploadProgress}
                      %
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">
                  {STATUS_DESCRIPTIONS[modalStatus]}
                </p>
              </div>
            ) : audioBlob ? (
              <div className="flex flex-col items-center">
                <p className="text-gray-600 mb-4">Opptak fullført</p>
                <button
                  onClick={handleUpload}
                  disabled={isLoading || isSaving}
                  className="button-primary px-8 py-4 text-lg flex items-center"
                >
                  {isLoading || isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Lagrer...
                    </>
                  ) : (
                    "Lagre opptak"
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartRecording}
                disabled={isLoading || !recordingTitle.trim()}
                className={cn(
                  "button-primary px-8 py-4 text-lg flex items-center",
                  !recordingTitle.trim() && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Starter...
                  </>
                ) : (
                  <>
                    <Mic className="h-6 w-6 mr-2" />
                    Start opptak
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            {isRecording && (
              <button
                onClick={handleStopRecording}
                className="button-primary bg-red-600 hover:bg-red-700"
              >
                Stopp opptak
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
