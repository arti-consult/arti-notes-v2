"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sparkles,
  CheckCircle2,
  Bot,
  FileText,
  MessageSquare,
  Wand2,
  Brain,
} from "lucide-react";

export function PurchaseCreditsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [credits, setCredits] = useState(50);

  const features = [
    {
      icon: Bot,
      title: "AI Apps",
      description: "Access to all AI-powered applications",
    },
    {
      icon: FileText,
      title: "Custom Summaries",
      description: "Generate personalized meeting summaries",
    },
    {
      icon: MessageSquare,
      title: "Automated Soundbites",
      description: "Extract key moments automatically",
    },
    {
      icon: Brain,
      title: "Smart Prompts",
      description: "Automate AskFred prompts for better insights",
    },
    {
      icon: Wand2,
      title: "Advanced Features",
      description: "Access to premium AI capabilities",
    },
  ];

  const calculatePrice = (credits: number) => {
    return (credits * 0.1).toFixed(2); // $0.10 per credit
  };

  const handleCreditsChange = (value: number[]) => {
    setCredits(value[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Kjøp AI-kreditter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden rounded-xl">
        <div className="grid grid-cols-[250px,1fr]">
          {/* Left Column - Features */}
          <div className="p-4 bg-[#27272A] border-r border-gray-800">
            <h3 className="font-semibold text-lg mb-4 text-gray-100">
              What's included with AI Credits
            </h3>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-[#3F3F46] flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                <span>7-day free trial with all features</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                <span>Cancel anytime, no commitments</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-violet-400" />
                <span>Credits shared with team members</span>
              </div>
            </div>
          </div>

          {/* Right Column - Credit Selection */}
          <div className="p-4 bg-[#27272A]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-center text-gray-100">
                Choose Your AI Credits
              </DialogTitle>
              <p className="text-sm text-center text-gray-400 mt-1">
                Select the number of credits you need per month
              </p>
            </DialogHeader>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <span className="font-medium text-sm text-gray-200">
                    {credits} AI Credits / mo
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-sm text-gray-200">
                    ${calculatePrice(credits)}/month
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Slider
                  value={[credits]}
                  onValueChange={handleCreditsChange}
                  min={50}
                  max={10000}
                  step={1243.75}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50</span>
                  <span>2,537</span>
                  <span>5,025</span>
                  <span>7,512</span>
                  <span>10,000</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                Estimated usage: ~10 credits per meeting summary
              </div>

              <div className="mt-4">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-gray-100">
                  Start Free Trial
                </Button>
                <p className="text-xs text-center text-gray-400 mt-2">
                  After 7 days, you'll be subscribed to the selected package.
                  You can change or cancel your plan at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
