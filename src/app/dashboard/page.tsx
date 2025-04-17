"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  FileText,
  BarChart,
  Timer as TimerIcon,
  Clock as ClockIcon,
  Clock3,
} from "lucide-react";
import { UploadDialog } from "./components/UploadDialog";
import { SearchBar } from "./components/SearchBar";
import { SidebarNavigation } from "./components/SidebarNavigation";

export default function DashboardPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string>();

  // Example data - replace with real data from your backend
  const folders = [
    { name: "Møter", count: 5 },
    { name: "Intervjuer", count: 3 },
    { name: "Personlig", count: 2 },
  ];

  const tags = [
    { name: "Viktig", count: 3 },
    { name: "Følg opp", count: 2 },
    { name: "Ferdig", count: 4 },
  ];

  const DashboardContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow hover:shadow-violet-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Totalt antall opptak
                </p>
                <h3 className="text-2xl font-semibold">0</h3>
              </div>
              <div className="p-3 rounded-lg">
                <BarChart className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow hover:shadow-violet-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Timer totalt
                </p>
                <h3 className="text-2xl font-semibold">0t 0m</h3>
              </div>
              <div className="p-3 rounded-lg">
                <Clock3 className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow hover:shadow-violet-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Tid spart
                </p>
                <h3 className="text-2xl font-semibold">0m</h3>
              </div>
              <div className="p-3 rounded-lg">
                <TimerIcon className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow hover:shadow-violet-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">
                  Snitt varighet
                </p>
                <h3 className="text-2xl font-semibold">0s</h3>
              </div>
              <div className="p-3 rounded-lg">
                <ClockIcon className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="hover:shadow-lg transition-shadow hover:shadow-violet-200 cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-lg bg-violet-600 group-hover:bg-violet-700 transition-colors">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Start opptak</h3>
                <p className="text-sm text-muted-foreground">
                  Begynn å ta opp et møte nå
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow hover:shadow-violet-200 cursor-pointer group"
          onClick={() => setUploadDialogOpen(true)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-lg bg-violet-100 group-hover:bg-violet-200 transition-colors">
                <FileText className="h-8 w-8 text-violet-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Last opp opptak</h3>
                <p className="text-sm text-muted-foreground">
                  Last opp eksisterende lydopptak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <SearchBar />
      </div>

      <div className="grid grid-cols-5 gap-6 mt-6">
        <div className="col-span-1">
          <SidebarNavigation
            folders={folders}
            tags={tags}
            selectedFolder={selectedFolder}
            selectedTag={selectedTag}
            onFolderSelect={setSelectedFolder}
            onTagSelect={setSelectedTag}
          />
        </div>
        <div className="col-span-4 bg-white rounded-lg p-4 shadow-sm border min-h-[calc(100vh-24rem)]">
          <div className="text-center text-gray-500 py-8">
            Ingen opptak funnet
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Mine opptak</h1>
        </div>

        <Tabs defaultValue="totalt" className="space-y-6">
          <TabsList>
            <TabsTrigger value="totalt">Totalt</TabsTrigger>
            <TabsTrigger value="idag">I dag</TabsTrigger>
            <TabsTrigger value="denneuken">Denne uken</TabsTrigger>
            <TabsTrigger value="dennemaneden">Denne måneden</TabsTrigger>
          </TabsList>

          <TabsContent value="totalt" className="space-y-6">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="idag" className="space-y-6">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="denneuken" className="space-y-6">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="dennemaneden" className="space-y-6">
            <DashboardContent />
          </TabsContent>
        </Tabs>
      </div>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </>
  );
}
