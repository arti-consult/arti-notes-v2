import OpenAI from 'openai';
import { validateEnv } from '@/lib/env';


// Initialize OpenAI client with validated API key
const env = validateEnv();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface TranscriptionSegment {
  text: string;
  timestamp: number;
}

export async function generateMeetingSummary(
  transcriptionId: string,
  content: TranscriptionSegment[]
) {
  try {
    console.log('Starting summary generation for transcription:', transcriptionId);
    
    // Verify we have content to summarize
    if (!content || content.length === 0) {
      console.error('No content provided for summary generation');
      throw new Error('Ingen transkripsjon å oppsummere');
    }

    const transcriptionText = content
      .map(segment => segment.text)
      .join('\n');

    // Verify we have text to summarize
    if (!transcriptionText.trim()) {
      console.error('Empty transcription text');
      throw new Error('Tom transkripsjon');
    }

    console.log('Preparing to send to OpenAI...');

    const prompt = `
      Du skal nå lage et sammendrag av følgende møtetranskript.
      Formater svaret ditt slik:

      SAMMENDRAG:
      [Skriv en grundig og detaljert referat av møtet basert på transkripsjonen.]

      HOVEDTEMAER:
      - [Tema 1]
      - [Tema 2]
      ...

      HANDLINGSPUNKTER:
      - [Handlingspunkt 1]
      - [Handlingspunkt 2]
      ...

      Transkript:
      ${transcriptionText}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Du er en profesjonell møteassistent som lager presise og strukturerte møtereferat av møter på norsk.
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    const summary = response.choices[0]?.message?.content;
    if (!summary) {
      throw new Error('Kunne ikke generere sammendrag');
    }

    console.log('Received summary from OpenAI, parsing sections...');

    // Parse the summary sections
    const summaryMatch = summary.match(/SAMMENDRAG:\n([\s\S]*?)(?=\n\nHOVEDTEMAER:|$)/i);
    const topicsMatch = summary.match(/HOVEDTEMAER:\n([\s\S]*?)(?=\n\nHANDLINGSPUNKTER:|$)/i);
    const actionItemsMatch = summary.match(/HANDLINGSPUNKTER:\n([\s\S]*?)$/i);

    // Extract and clean up the sections
    const generalSummary = summaryMatch ? 
      summaryMatch[1].trim() : 
      'Kunne ikke generere sammendrag';

    const topics = topicsMatch ? 
      topicsMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-•]\s*/, '').trim())
        .filter(line => line.length > 0) :
      [];

    const actionItems = actionItemsMatch ? 
      actionItemsMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-•]\s*/, '').trim())
        .filter(line => line.length > 0) :
      [];

    console.log('Updating transcription with summary...', {
      summaryLength: generalSummary.length,
      topicsCount: topics.length,
      actionItemsCount: actionItems.length
    });

    // Update the transcription with the summary
    const { error: updateError } = await supabase
      .from('transcriptions')
      .update({
        summary_text: generalSummary,
        summary_topics: topics,
        action_items: actionItems,
        updated_at: new Date().toISOString()
      })
      .eq('id', transcriptionId);

    if (updateError) {
      console.error('Error updating transcription with summary:', updateError);
      throw updateError;
    }

    console.log('Summary generation completed successfully');

    return {
      summary: generalSummary,
      topics,
      actionItems
    };
  } catch (error) {
    console.error('Error in generateMeetingSummary:', error);
    throw new Error('Kunne ikke generere sammendrag: ' + (error instanceof Error ? error.message : 'Ukjent feil'));
  }
}