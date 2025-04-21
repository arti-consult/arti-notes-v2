"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  Users,
  User,
  Target,
  X,
  ArrowRight,
} from "lucide-react";

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = [
    {
      icon: Target,
      title: "Generate key highlights",
      description: "from last week's meetings",
    },
    {
      icon: ArrowRight,
      title: "List out my action items",
      description: "from the past week",
    },
    {
      icon: Target,
      title: "What topics were covered in",
      description: "my meetings this week?",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative w-[400px] justify-start text-sm text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Ask anything across your meetings</span>
          <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] h-[90vh] max-w-none">
        <div className="h-full flex flex-col items-center max-w-5xl mx-auto">
          <DialogHeader className="w-full">
            <DialogTitle className="text-center text-2xl font-normal">
              Hi! How can I help today?
            </DialogTitle>
          </DialogHeader>
          <div className="mt-8 w-full flex flex-col items-center flex-1">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ask anything across your meetings"
                  className="pl-8 pr-20"
                />
                <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 overflow-x-auto pb-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full whitespace-nowrap"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full whitespace-nowrap"
              >
                <Users className="mr-2 h-4 w-4" />
                All Meetings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full whitespace-nowrap"
              >
                <User className="mr-2 h-4 w-4" />
                Host
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full whitespace-nowrap"
              >
                <Users className="mr-2 h-4 w-4" />
                Participant
              </Button>
            </div>
            <div className="mt-12 w-full max-w-4xl grid grid-cols-3 gap-6 px-4">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-40 flex-col items-start justify-start p-6 text-left hover:bg-violet-50"
                >
                  <suggestion.icon className="h-10 w-10 text-violet-600 mb-4" />
                  <div>
                    <p className="font-medium text-lg">{suggestion.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
