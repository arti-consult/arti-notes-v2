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
      <DialogContent className="sm:max-w-[1100px] p-0 gap-0">
        <div className="grid grid-cols-[500px,1fr]">
          {/* Left Column - Features */}
          <div className="p-8 bg-violet-50 border-r">
            <h3 className="font-semibold text-2xl mb-8">
              What's included with AI Credits
            </h3>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center">
                    <feature.icon className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-violet-600" />
                <span>7-day free trial with all features</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <CheckCircle2 className="h-4 w-4 text-violet-600" />
                <span>Cancel anytime, no commitments</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <CheckCircle2 className="h-4 w-4 text-violet-600" />
                <span>Credits shared with team members</span>
              </div>
            </div>
          </div>

          {/* Right Column - Credit Selection */}
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center">
                Choose Your AI Credits
              </DialogTitle>
              <p className="text-center text-muted-foreground mt-2">
                Select the number of credits you need per month
              </p>
            </DialogHeader>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  <span className="font-medium">{credits} AI Credits / mo</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">
                    ${calculatePrice(credits)}/month
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Slider
                  value={[credits]}
                  onValueChange={handleCreditsChange}
                  min={50}
                  max={10000}
                  step={1243.75}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>50</span>
                  <span>1,293</span>
                  <span>2,537</span>
                  <span>3,781</span>
                  <span>5,025</span>
                  <span>6,268</span>
                  <span>7,512</span>
                  <span>8,756</span>
                  <span>10,000</span>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Estimated usage: ~10 credits per meeting summary
              </div>

              <div className="mt-8 space-y-4">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12 text-lg">
                  Start Free Trial
                </Button>
                <p className="text-xs text-center text-muted-foreground">
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
