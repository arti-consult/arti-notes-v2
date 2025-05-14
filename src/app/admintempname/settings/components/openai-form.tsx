"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OpenAIForm() {
  const [apiKey, setApiKey] = useState("");
  const [transcriptionPrompt, setTranscriptionPrompt] = useState("");
  const [summaryPrompt, setSummaryPrompt] = useState("");
  const [bulletPointsPrompt, setBulletPointsPrompt] = useState("");
  const [chatResponsePrompt, setChatResponsePrompt] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("2000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    console.log({
      apiKey,
      transcriptionPrompt,
      summaryPrompt,
      bulletPointsPrompt,
      chatResponsePrompt,
      temperature,
      maxTokens,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenAI Settings</CardTitle>
        <CardDescription>
          Configure your OpenAI prompt settings and parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transcriptionPrompt">
                Transcription Summary Prompt
              </Label>
              <Textarea
                id="transcriptionPrompt"
                value={transcriptionPrompt}
                onChange={(e) => setTranscriptionPrompt(e.target.value)}
                placeholder="Enter your transcription summary prompt here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summaryPrompt">Summary Prompt</Label>
              <Textarea
                id="summaryPrompt"
                value={summaryPrompt}
                onChange={(e) => setSummaryPrompt(e.target.value)}
                placeholder="Enter your summary prompt here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulletPointsPrompt">
                Bullet Points Summary Prompt
              </Label>
              <Textarea
                id="bulletPointsPrompt"
                value={bulletPointsPrompt}
                onChange={(e) => setBulletPointsPrompt(e.target.value)}
                placeholder="Enter your bullet points summary prompt here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chatResponsePrompt">
                AI Chat Response Prompt
              </Label>
              <Textarea
                id="chatResponsePrompt"
                value={chatResponsePrompt}
                onChange={(e) => setChatResponsePrompt(e.target.value)}
                placeholder="Enter your AI chat response prompt here..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                min="0"
                max="2"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
                min="1"
                max="4000"
              />
            </div>
          </div>

          <Button type="submit">Save Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
}
