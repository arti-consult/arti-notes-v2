import { supabase } from "./supabase";
import { validateEnv } from "./env";
import { OpenAI } from "openai";
import { toast } from "@/components/ui/toast";
import type { TranscriptionSegment } from "@/types/database";

const env = validateEnv();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
export async function generateSummary(
  transcriptionId: string,
  segments: TranscriptionSegment[]
) {
  try {
    console.log(
      "Starting summary generation for transcription:",
      transcriptionId
    );

    // Verify we have content to summarize
    if (!segments || segments.length === 0) {
      throw new Error("Ingen tekst å oppsummere");
    }

    const text = segments.map((s) => s.text).join(" ");

    // Verify we have text to summarize
    if (!text.trim()) {
      throw new Error("Tom transkripsjon");
    }

    console.log("Preparing to send to OpenAI...", {
      textLength: text.length,
      segmentsCount: segments.length,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Du er en erfaren møteassistent som lager presise møtereferat på norsk. 
Du SKAL alltid inkludere følgende seksjoner i ditt svar:
1. Et sammendrag av møtet
2. En liste over hovedtemaer som ble diskutert
3. En liste over konkrete handlingspunkter

Selv for korte møter skal du alltid finne minst:
- Ett tema å liste under HOVEDTEMAER
- Ett punkt å liste under HANDLINGSPUNKTER

Hvis møtet virker ufullstendig eller uformelt, lag fortsatt et sammendrag 
basert på det som ble sagt og marker det som et uformelt møte i sammendraget.`,
        },
        {
          role: "user",
          content: `Analyser følgende møtetranskript og lag et referat.
Du MÅ formatere svaret NØYAKTIG slik:
 
SAMMENDRAG:
(Skriv en oppsummering av møtets innhold her)

HOVEDTEMAER:
- (List minst ett tema som ble diskutert)
- (List flere temaer hvis relevant)

HANDLINGSPUNKTER:
- (List minst ett konkret handlingspunkt)
- (List flere handlingspunkter hvis relevant)

Transkript:
${text}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 5000,
    });

    const summary = response.choices[0]?.message?.content;
    if (!summary) {
      console.error("No summary received from OpenAI");
      throw new Error("Kunne ikke generere sammendrag");
    }

    console.log("Received summary from OpenAI, parsing sections...");
    console.log("Raw summary:", summary);

    // Parse sections
    const summaryMatch = summary.match(
      /SAMMENDRAG:\n([\s\S]*?)(?=\n\nHOVEDTEMAER:|$)/i
    );
    const topicsMatch = summary.match(
      /HOVEDTEMAER:\n([\s\S]*?)(?=\n\nHANDLINGSPUNKTER:|$)/i
    );
    const actionItemsMatch = summary.match(/HANDLINGSPUNKTER:\n([\s\S]*?)$/i);

    if (!summaryMatch || !topicsMatch || !actionItemsMatch) {
      console.error("Failed to parse summary sections:", {
        hasSummaryMatch: !!summaryMatch,
        hasTopicsMatch: !!topicsMatch,
        hasActionItemsMatch: !!actionItemsMatch,
      });
      throw new Error("Kunne ikke tolke sammendraget fra OpenAI");
    }

    // Extract and clean up the sections
    const summaryText = summaryMatch ? summaryMatch[1].trim() : "";
    const topics = topicsMatch
      ? topicsMatch[1]
          .split("\n")
          .map((line) => line.replace(/^[-•]\s*/, "").trim())
          .filter(Boolean)
      : [];
    const actionItems = actionItemsMatch
      ? actionItemsMatch[1]
          .split("\n")
          .map((line) => line.replace(/^[-•]\s*/, "").trim())
          .filter(Boolean)
      : [];

    // Validate extracted content
    if (!summaryText || topics.length === 0 || actionItems.length === 0) {
      console.error("Invalid summary content:", {
        summaryText,
        topics,
        actionItems,
      });
      throw new Error("Kunne ikke generere et komplett sammendrag");
    }

    console.log("Parsed summary sections:", {
      hasSummaryText: !!summaryText,
      topicsCount: topics.length,
      actionItemsCount: actionItems.length,
    });

    // Update database
    const { error } = await supabase
      .from("transcriptions")
      .update({
        summary_text: summaryText,
        summary_topics: topics,
        action_items: actionItems,
        updated_at: new Date().toISOString(),
      })
      .eq("id", transcriptionId);

    if (error) {
      console.error("Error updating transcription with summary:", error);
      throw error;
    }

    console.log("Successfully updated transcription with summary");

    return { summaryText, topics, actionItems };
  } catch (error) {
    console.error("Summary generation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Kunne ikke generere sammendrag";

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}
