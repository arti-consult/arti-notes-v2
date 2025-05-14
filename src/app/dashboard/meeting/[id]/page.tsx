"use client";

import { useState, useEffect, useRef } from "react";
import { use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Meeting } from "@/app/dashboard/components/meeting-list";
import {
  PlayCircle,
  Download,
  Share2,
  FileText,
  Video,
  MessageSquare,
  Settings2,
  ChevronRight,
  Home,
  ListChecks,
  List,
  Bot,
  Send,
  RefreshCw,
  SkipBack,
  SkipForward,
  CalendarIcon,
  Pause,
  FileIcon,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";

type Tab = {
  icon: typeof FileText;
  value: string;
  tooltip: string;
};

const tabs: Tab[] = [
  { icon: FileText, value: "notes", tooltip: "Notater" },
  { icon: Video, value: "video", tooltip: "Video" },
  { icon: MessageSquare, value: "transcript", tooltip: "Transkripsjon" },
  { icon: Bot, value: "chat", tooltip: "AI Chat" },
  { icon: Settings2, value: "settings", tooltip: "Innstillinger" },
];

// Add these interfaces near the top of the file, after the imports
interface TranscriptionSegment {
  end: number;
  text: string;
  start: number;
  confidence: number;
}

interface TranscriptionContent {
  metadata: {
    status: string;
    version: string;
    language: string;
    speaker_count: number;
  };
  segments: TranscriptionSegment[];
  transcription: string;
}

interface Transcription {
  id: string;
  recording_id: string;
  user_id: string;
  status: string;
  language: string;
  content: TranscriptionContent;
  summary_text: string | null;
  summary_topics: any[];
  action_items: any[];
  speaker_count: number;
  confidence_score: number;
  word_count: number;
  api_job_id: string | null;
  api_recording_id: string | null;
  created_at: string;
  updated_at: string;
}

// Add this interface near the other interfaces

export default function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  // Group all useState hooks together at the top
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notes");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcription, setTranscription] = useState<Transcription | null>(
    null
  );
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hei! Jeg er din AI-assistent for dette møtet. Jeg kan hjelpe deg med å analysere møtet, svare på spørsmål om innholdet, eller lage sammendrag. Hva vil du vite mer om?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [recordingData, setRecordingData] = useState<any>(null);

  // useRef after useState
  const audioRef = useRef<HTMLAudioElement>(null);

  // Add state for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Add useEffect for responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Group all useEffect hooks together
  useEffect(() => {
    console.log("Recording URL updated:", recordingUrl);
  }, [recordingUrl]);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("meetings")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error) throw error;

        if (data) {
          setMeeting({
            id: data.id,
            title: data.title,
            startTime: new Date(data.start_time || data.created_at),
            endTime: new Date(
              data.end_time || new Date(data.created_at).getTime() + 3600000
            ),
            meeting_type: data.meeting_type,
            transcription_status: data.transcription_status || "pending",
            summary_status: data.summary_status || "pending",
            participants: data.participants || [],
          });

          // First get the recording for this meeting
          const { data: recordingData, error: recordingError } = await supabase
            .from("recordings")
            .select("*")
            .eq("meeting_id", data.id)
            .single();

          if (recordingError) {
            console.error("Error fetching recording:", recordingError);
            return;
          }

          if (recordingData?.duration) {
            console.log(
              "Setting initial duration from recording data:",
              recordingData.duration
            );
            setDuration(recordingData.duration);
          }

          setRecordingData(recordingData);

          if (recordingData?.file_path) {
            try {
              const storagePath = recordingData.file_path.includes(
                "recordings/"
              )
                ? recordingData.file_path
                : `recordings/${recordingData.file_path}`;

              const { data: signedUrlData, error: signedUrlError } =
                await supabase.storage
                  .from("audio-recordings")
                  .createSignedUrl(storagePath, 3600);

              if (signedUrlError) throw signedUrlError;

              if (signedUrlData?.signedUrl) {
                console.log("Setting signed URL:", signedUrlData.signedUrl);
                setRecordingUrl(signedUrlData.signedUrl);
                setIsAudioReady(true);
              }
            } catch (storageError) {
              console.error("Error getting signed URL:", storageError);
            }
          }

          // Then get the transcription using the recording_id
          if (recordingData?.id) {
            const { data: transcriptionData, error: transcriptionError } =
              await supabase
                .from("transcriptions")
                .select("*")
                .eq("recording_id", recordingData.id)
                .single();

            if (transcriptionError) {
              console.error(
                "Error fetching transcription:",
                transcriptionError
              );
            } else {
              setTranscription(transcriptionData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching meeting:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeeting();
  }, [resolvedParams.id]);

  // Remove the duplicate useEffect for getting signed URL
  useEffect(() => {
    if (!recordingUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      console.log("Audio can play");
      setIsAudioReady(true);
    };

    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded, duration:", audio.duration);
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      } else if (recordingData?.duration) {
        setDuration(recordingData.duration);
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Audio loading error:", e);
      setIsAudioReady(false);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
    };
  }, [recordingUrl, recordingData]);

  // Remove other duplicate useEffects for audio handling

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#18181B]">
        <div className="text-center">
          <p className="text-gray-400">Laster møte...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#18181B]">
        <div className="text-center">
          <p className="text-gray-400">Møte ikke funnet</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input.trim() };
    const aiResponse = {
      role: "assistant",
      content: "La meg analysere møtet basert på spørsmålet ditt...",
    };

    setMessages((prev) => [...prev, newMessage, aiResponse]);
    setInput("");

    // Scroll to bottom of messages after adding new ones
    requestAnimationFrame(() => {
      const scrollArea = document.querySelector("[data-scroll-area]");
      if (scrollArea) {
        const scrollableParent = scrollArea.parentElement;
        if (scrollableParent) {
          scrollableParent.scrollTo({
            top: scrollableParent.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    });
  };

  const handlePlayPause = async () => {
    if (!audioRef.current) {
      console.error("No audio element found");
      return;
    }

    if (!recordingUrl) {
      console.error("No recording URL available");
      return;
    }

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log("Attempting to play audio from URL:", recordingUrl);
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio playback started successfully");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Audio playback failed:", error);
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTimeValue = audioRef.current.currentTime;
      const durationValue = audioRef.current.duration;

      setCurrentTime(isNaN(currentTimeValue) ? 0 : currentTimeValue);

      if (!isNaN(durationValue) && isFinite(durationValue)) {
        setDuration(durationValue);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds: number | null) => {
    if (
      timeInSeconds === null ||
      isNaN(timeInSeconds) ||
      !isFinite(timeInSeconds)
    ) {
      return "0:00";
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    // Ensure seconds are padded with leading zero if needed
    const paddedSeconds = seconds.toString().padStart(2, "0");
    return `${minutes}:${paddedSeconds}`;
  };

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className="max-w-4xl mx-auto space-y-8 bg-[#18181B]">
            {/* Meeting Summary */}
            <div className="bg-[#18181B] rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Møtesammendrag
              </h2>
              <p className="text-sm text-gray-400">
                Dette møtet fokuserte på gjennomgang av Fireflies AI Platform.
                Hovedtemaene inkluderte plattformfunksjoner, integrasjoner og
                fremtidige utviklingsplaner. Det ble diskutert spesifikke
                brukstilfeller og potensielle forbedringer for
                brukeropplevelsen.
              </p>
            </div>

            {/* Meeting Outline */}
            <div className="bg-[#18181B] rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <ListChecks className="h-5 w-5" />
                Møteoversikt
              </h2>
              <div className="space-y-4">
                <div className="border-l-2 border-violet-600 pl-4">
                  <div className="flex items-center gap-2 text-violet-600 font-medium">
                    <button className="hover:underline">00:00 - 02:15</button>
                    <span className="text-white">Introduksjon og agenda</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Velkommen og gjennomgang av dagens agenda
                  </p>
                </div>
                <div className="border-l-2 border-violet-600 pl-4">
                  <div className="flex items-center gap-2 text-violet-600 font-medium">
                    <button className="hover:underline">02:15 - 04:30</button>
                    <span className="text-white">Plattformoversikt</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Gjennomgang av hovedfunksjonene i plattformen
                  </p>
                </div>
                <div className="border-l-2 border-violet-600 pl-4">
                  <div className="flex items-center gap-2 text-violet-600 font-medium">
                    <button className="hover:underline">04:30 - 08:39</button>
                    <span className="text-white">
                      Demonstrasjon og spørsmål
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Live demonstrasjon av funksjonalitet og Q&A
                  </p>
                </div>
              </div>
            </div>

            {/* Bullet Points */}
            <div className="bg-[#18181B] rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <List className="h-5 w-5" />
                Hovedpunkter
              </h2>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 mt-1">•</span>
                  Introduserte ny søkefunksjonalitet for raskere navigering i
                  møteinnhold
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 mt-1">•</span>
                  Demonstrerte AI-drevet transkripsjon med 95% nøyaktighet
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 mt-1">•</span>
                  Diskuterte kommende integrasjoner med populære
                  samarbeidsverktøy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-600 mt-1">•</span>
                  Planla lanseringen av nye analysefunksjoner i Q3
                </li>
              </ul>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="max-w-4xl mx-auto bg-[#18181B]">
            <div className="bg-[#18181B] rounded-lg border p-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <Video className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>
        );
      case "transcript":
        return (
          <div className="max-w-4xl mx-auto space-y-4 bg-[#18181B]">
            <div className="bg-[#18181B] rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Last ned transkripsjon
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-[#18181B]" align="end">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-gray-800 text-white"
                        onClick={() => {
                          // TODO: Implement Word doc download
                          console.log("Download as Word");
                        }}
                      >
                        <FileIcon className="h-4 w-4 mr-2" />
                        Word dokument
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-gray-800 text-white"
                        onClick={() => {
                          // TODO: Implement PDF download
                          console.log("Download as PDF");
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-6">
                {transcription?.content?.segments ? (
                  transcription.content.segments.map((segment, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start gap-4">
                        <button
                          className="text-sm text-violet-600 hover:underline mt-1 w-16 text-right"
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.currentTime = segment.start;
                              audioRef.current.play();
                              setIsPlaying(true);
                            }
                          }}
                        >
                          {formatTimestamp(segment.start)}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-violet-900 flex items-center justify-center text-xs text-white">
                              {transcription.speaker_count > 1
                                ? `S${(index % 2) + 1}`
                                : "S1"}
                            </div>
                            <span className="font-medium text-white">
                              {transcription.speaker_count > 1
                                ? `Speaker ${(index % 2) + 1}`
                                : "Speaker 1"}
                            </span>
                            {segment.confidence && (
                              <span className="text-xs text-gray-400">
                                ({Math.round(segment.confidence * 100)}%
                                confidence)
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {segment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    Ingen transkripsjon tilgjengelig
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "chat":
        return (
          <div className="max-w-4xl mx-auto h-full flex flex-col bg-[#18181B]">
            <div className="bg-[#18181B] rounded-lg border flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 relative h-[calc(100vh-300px)]">
                <ScrollArea
                  className="absolute inset-0 h-full"
                  data-scroll-area
                >
                  <div className="p-4 space-y-4">
                    <AnimatePresence initial={false}>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            message.role === "user"
                              ? "flex justify-end"
                              : "flex justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "flex gap-3 max-w-[80%]",
                              message.role === "assistant"
                                ? "flex-row bg-gray-900 rounded-2xl p-4"
                                : "flex-row-reverse bg-violet-900 rounded-2xl p-4"
                            )}
                          >
                            {message.role === "assistant" ? (
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-violet-900 text-white">
                                  AI
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-violet-600 text-white">
                                  U
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex flex-col gap-1">
                              <p
                                className={cn(
                                  "text-sm font-medium text-white",
                                  message.role === "user"
                                    ? "text-right"
                                    : "text-left"
                                )}
                              >
                                {message.role === "assistant"
                                  ? "AI Assistent"
                                  : ""}
                              </p>
                              <p
                                className={cn(
                                  "text-sm",
                                  message.role === "assistant"
                                    ? "text-gray-400"
                                    : "text-white"
                                )}
                              >
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="max-w-4xl mx-auto bg-[#18181B]">
            <div className="bg-[#18181B] rounded-lg border p-6">
              <p className="text-sm text-gray-400">
                Innstillinger kommer snart...
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#18181B]">
      {/* Mobile Menu Button */}
      <button
        className={cn(
          "md:hidden fixed top-4 left-4 z-50 p-2 bg-[#18181B] rounded-lg border shadow-sm",
          isSidebarOpen && "left-[210px]"
        )}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className={cn(
              "fixed md:relative z-40 h-full bg-[#18181B] border-r",
              isMobile ? "w-[200px]" : "w-[50px]"
            )}
          >
            <div className="flex flex-col items-center py-4">
              <TooltipProvider>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tooltip key={tab.value} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            setActiveTab(tab.value);
                            if (isMobile) setIsSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full p-3 flex items-center justify-center hover:bg-gray-800 transition-colors gap-2 text-white",
                            activeTab === tab.value &&
                              "bg-violet-900 text-violet-100",
                            isMobile && "justify-start px-4"
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {isMobile && (
                            <span className="text-sm">{tab.tooltip}</span>
                          )}
                        </button>
                      </TooltipTrigger>
                      {!isMobile && (
                        <TooltipContent
                          side="right"
                          sideOffset={10}
                          className="bg-[#18181B] text-white"
                        >
                          {tab.tooltip}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="fixed inset-0 bg-black z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Breadcrumb */}
        <div className="border-b px-4 py-2 bg-[#18181B]">
          <div className="flex items-center gap-2 text-sm text-gray-400 max-w-full overflow-hidden">
            <Link
              href="/dashboard"
              className="hover:text-white flex items-center gap-1 shrink-0"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <Link
              href="/dashboard/meetings"
              className="hover:text-white truncate"
            >
              <span className="hidden sm:inline">Møter</span>
              <span className="sm:hidden">...</span>
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="text-white truncate">
              {meeting?.title || "Møte"}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="border-b bg-[#18181B]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <h1 className="text-xl font-semibold truncate max-w-[200px] sm:max-w-none text-white">
                {meeting.title}
              </h1>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-white"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(meeting.startTime, "d. MMMM yyyy", { locale: nb })}
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-[#18181B]" align="end">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-gray-800"
                      onClick={() => {
                        // TODO: Implement Word doc download
                        console.log("Download as Word");
                      }}
                    >
                      <FileIcon className="h-4 w-4 mr-2" />
                      Word dokument
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-gray-800"
                      onClick={() => {
                        // TODO: Implement PDF download
                        console.log("Download as PDF");
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">{renderTabContent()}</div>

        {/* Playback Controls */}
        <div className="border-t bg-[#18181B]">
          <div className="p-4 max-w-[1400px] mx-auto space-y-4">
            {/* Chat Input when in Chat Tab */}
            {activeTab === "chat" && (
              <div className="flex gap-2 max-w-[1400px] mx-auto">
                <Textarea
                  placeholder="Still et spørsmål om møtet..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[60px] max-h-[120px] resize-none flex-1 bg-[#18181B] text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="icon"
                    className="bg-violet-600 hover:bg-violet-700 transition-colors"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="transition-colors hover:bg-gray-800 text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Audio Controls */}
            <div className="flex items-center gap-4">
              {/* Time Display */}
              <div className="w-[100px] text-sm font-medium text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Main Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-gray-800"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.max(
                        0,
                        audioRef.current.currentTime - 10
                      );
                    }
                  }}
                  disabled={!isAudioReady}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 text-violet-600 hover:text-violet-700 hover:bg-gray-800"
                  onClick={handlePlayPause}
                  disabled={!isAudioReady}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <PlayCircle className="h-8 w-8" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white hover:bg-gray-800"
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.min(
                        audioRef.current.duration || duration || 0,
                        audioRef.current.currentTime + 10
                      );
                    }
                  }}
                  disabled={!isAudioReady}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 px-4">
                <Slider
                  value={[currentTime]}
                  max={isFinite(duration) ? duration : 100}
                  step={1}
                  className="w-full"
                  onValueChange={handleSeek}
                  disabled={!isAudioReady}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={recordingUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
        crossOrigin="anonymous"
      />
    </div>
  );
}
