"use client";

import { useState, useCallback } from "react";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewMeetingDropdown } from "./new-meeting-dropdown";

interface NewMeetingAreaProps {
  onFileUpload: (file: File) => void;
}

export function NewMeetingArea({ onFileUpload }: NewMeetingAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        setSelectedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 ">
      <div className="flex items-center gap-4">
        <NewMeetingDropdown />
        <Button
          variant="outline"
          className="gap-2 px-8 py-6 text-lg hover:text-[#145DFC] cursor-pointer "
          size="default"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Plus className="h-5 w-5" />
          Last opp møte
        </Button>
      </div>

      {isExpanded && (
        <div
          className={cn(
            "w-full max-w-md flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ",
            isDragging
              ? "border-violet-500 "
              : "border-gray-700 hover:border-gray-600"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Dra og slipp møtefil her
                  </p>
                  <p className="text-xs text-muted-foreground">eller</p>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".mp4,.mov,.wav,.mp3"
                    onChange={handleFileSelect}
                  />
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Velg fil
                  </Button>
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
