"use client";

import { useState } from "react";
import {
  Clock,
  PlayCircle,
  Undo,
  Redo,
  Download,
  ThumbsUp,
  ThumbsDown,
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
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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

export default function MeetingPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("notes");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hei! Jeg er din AI-assistent for dette møtet. Jeg kan hjelpe deg med å analysere møtet, svare på spørsmål om innholdet, eller lage sammendrag. Hva vil du vite mer om?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: "user", content: input },
      {
        role: "assistant",
        content: "La meg analysere møtet basert på spørsmålet ditt...",
      },
    ]);
    setInput("");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Meeting Summary */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Møtesammendrag</h2>
              <p className="text-sm text-muted-foreground">
                Dette møtet fokuserte på gjennomgang av Fireflies AI Platform.
                Hovedtemaene inkluderte plattformfunksjoner, integrasjoner og
                fremtidige utviklingsplaner. Det ble diskutert spesifikke
                brukstilfeller og potensielle forbedringer for
                brukeropplevelsen.
              </p>
            </div>

            {/* Meeting Outline */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Møteoversikt
              </h2>
              <div className="space-y-4">
                <div className="border-l-2 border-violet-600 pl-4">
                  <div className="flex items-center gap-2 text-violet-600 font-medium">
                    <button className="hover:underline">00:00 - 02:15</button>
                    <span>Introduksjon og agenda</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Velkommen og gjennomgang av dagens agenda
                  </p>
                </div>
                <div className="border-l-2 border-violet-600 pl-4">
                  <div className="flex items-center gap-2 text-violet-600 font-medium">
                    <button className="hover:underline">02:15 - 04:30</button>
                    <span>Plattformoversikt</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gjennomgang av hovedfunksjonene i plattformen
                  </p>
                </div>
                <div className="border-l-2 border-violet-600 pl-4">
                  <div className="flex items-center gap-2 text-violet-600 font-medium">
                    <button className="hover:underline">04:30 - 08:39</button>
                    <span>Demonstrasjon og spørsmål</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Live demonstrasjon av funksjonalitet og Q&A
                  </p>
                </div>
              </div>
            </div>

            {/* Bullet Points */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <List className="h-5 w-5" />
                Hovedpunkter
              </h2>
              <ul className="space-y-2 text-sm">
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border p-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Video className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>
        );
      case "transcript":
        return (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Søk i transkripsjon..."
                    className="w-[300px]"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Last ned transkripsjon
                </Button>
              </div>
              <div className="space-y-6">
                {/* Speaker 1 */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <button className="text-sm text-violet-600 hover:underline mt-1 w-16 text-right">
                      00:00
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs">
                          KR
                        </div>
                        <span className="font-medium">Krish Ramineni</span>
                      </div>
                      <p className="text-sm">
                        Velkommen alle sammen til denne gjennomgangen av
                        Fireflies AI Platform. I dag skal vi se nærmere på de
                        nye funksjonene og hvordan de kan hjelpe oss med å
                        effektivisere møtenotatene våre.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Speaker 2 */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <button className="text-sm text-violet-600 hover:underline mt-1 w-16 text-right">
                      00:45
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                          JS
                        </div>
                        <span className="font-medium">John Smith</span>
                      </div>
                      <p className="text-sm">
                        Kan du fortelle oss mer om den nye søkefunksjonaliteten?
                        Spesielt interessert i hvordan vi kan filtrere på
                        spesifikke deler av møtet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Speaker 1 Response */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <button className="text-sm text-violet-600 hover:underline mt-1 w-16 text-right">
                      01:15
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs">
                          KR
                        </div>
                        <span className="font-medium">Krish Ramineni</span>
                      </div>
                      <p className="text-sm">
                        Absolutt! Den nye søkefunksjonen lar deg ikke bare søke
                        i tekst, men også filtrere på tidsintervaller, talere,
                        og til og med sentimentanalyse. For eksempel kan du
                        finne alle positive kommentarer om et spesifikt tema.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Speaker 3 */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <button className="text-sm text-violet-600 hover:underline mt-1 w-16 text-right">
                      02:30
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">
                          AK
                        </div>
                        <span className="font-medium">Anna Kowalski</span>
                      </div>
                      <p className="text-sm">
                        Dette høres spennende ut. Hvordan fungerer integrasjonen
                        med andre verktøy vi bruker, som for eksempel
                        prosjektstyringsverktøy?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Speaker 1 Response */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <button className="text-sm text-violet-600 hover:underline mt-1 w-16 text-right">
                      03:00
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs">
                          KR
                        </div>
                        <span className="font-medium">Krish Ramineni</span>
                      </div>
                      <p className="text-sm">
                        God timing! Vi har nettopp lansert nye API-er som gjør
                        det mulig å integrere direkte med de mest populære
                        prosjektstyringsverktøyene. Dette betyr at oppgaver og
                        handlingspunkter automatisk kan synkroniseres.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "chat":
        return (
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="bg-white rounded-lg border flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3 p-4 rounded-lg",
                        message.role === "assistant" ? "bg-gray-50" : ""
                      )}
                    >
                      {message.role === "assistant" ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-violet-100 text-violet-900">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">
                          {message.role === "assistant" ? "AI Assistent" : "Du"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Still et spørsmål om møtet..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[60px]"
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
                      className="bg-violet-600 hover:bg-violet-700"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Trykk Enter for å sende, Shift + Enter for ny linje
                </p>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border p-6">
              <p className="text-sm text-muted-foreground">
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
    <div className="flex h-screen">
      {/* Small Sidebar */}
      <div className="w-[50px] border-r flex flex-col items-center py-4 bg-gray-50/50">
        <TooltipProvider>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.value} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "w-full p-3 flex items-center justify-center hover:bg-gray-100 transition-colors",
                      activeTab === tab.value && "bg-violet-50 text-violet-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {tab.tooltip}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <div className="border-b px-4 py-2 bg-gray-50/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/dashboard" className="hover:text-foreground">
              Møter
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">
              Fireflies AI Platform Quick Overview
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">
                Fireflies AI Platform Quick Overview
              </h1>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Aug 08 2024
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-y-auto">{renderTabContent()}</div>

        {/* Playback Controls */}
        <div className="border-t bg-white">
          <div className="p-4 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
              {/* Time Display */}
              <div className="w-[100px] text-sm font-medium">00:11 / 08:39</div>

              {/* Main Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 text-violet-600 hover:text-violet-700"
                >
                  <PlayCircle className="h-8 w-8" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Redo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 px-4">
                <div className="relative">
                  <Slider
                    defaultValue={[33]}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  {/* Time Markers */}
                  <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                    <span>|</span>
                  </div>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2 w-[140px]">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Slider
                  defaultValue={[75]}
                  max={100}
                  step={1}
                  className="w-[100px]"
                />
              </div>

              {/* Playback Speed */}
              <Select defaultValue="1">
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue placeholder="1x" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
