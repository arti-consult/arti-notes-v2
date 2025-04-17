import { useState } from 'react';
import { Send } from 'lucide-react';

import { cn } from '@/lib/utils';
import { openai } from '@/lib/openai';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useTranscriptionChunks } from '@/hooks/useTranscriptionChunks';
import ChatMessageList from './ChatMessageList';
import { sanitizeInput } from '@/lib/security';

interface MeetingChatProps {
  recordingId: string;
  transcription: {
    content: Array<{
      text: string;
      timestamp: number;
    }>;
    summary_text?: string;
    summary_topics?: string[];
    action_items?: string[];
  };
}

export default function MeetingChat({ recordingId, transcription }: MeetingChatProps) {
  const { 
    messages, 
    isLoading, 
    error, 
    hasMore, 
    loadMoreMessages, 
    addMessage,
    updateMessageStatus 
  } = useChatMessages(recordingId);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const transcriptionChunks = useTranscriptionChunks(transcription.content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isTyping) return;
    
    const sanitizedMessage = sanitizeInput(newMessage.trim());
    if (!sanitizedMessage) return;
    
    try {
      setIsTyping(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Du må være logget inn for å sende meldinger');
      }

      // Verify user has access to this recording
      const { data: recording, error: recordingError } = await supabase
        .from('recordings')
        .select('user_id')
        .eq('id', recordingId)
        .single();

      if (recordingError || !recording || recording.user_id !== user.id) {
        throw new Error('Ingen tilgang til dette opptaket');
      }

      // Save user message
      const { data: userMessage, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          recording_id: recordingId,
          user_id: user.id,
          role: 'user',
          content: sanitizedMessage
        })
        .select()
        .single();

      if (userError) throw userError;      
      addMessage({ ...userMessage, status: 'sending' });
      setNewMessage('');

      // Prepare context for AI
      const context = `
Møtesammendrag:
${transcription.summary_text || 'Ikke tilgjengelig'}

Hovedtemaer:
${transcription.summary_topics?.map(topic => `- ${topic}`).join('\n') || 'Ikke tilgjengelig'}

Handlingspunkter:
${transcription.action_items?.map(item => `- ${item}`).join('\n') || 'Ikke tilgjengelig'}

Transkripsjon:
${transcription.content.map(segment => segment.text).join(' ')}
`;

      // Get AI response
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Du er en hjelpsom møteassistent som svarer på spørsmål om møtet. 
Bruk konteksten til å gi presise og relevante svar. 
Hvis du er usikker, si det ærlig.
Svar alltid på norsk.`
          },
          {
            role: 'user',
            content: `Kontekst om møtet:
${context}

Spørsmål: ${sanitizedMessage}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) throw new Error('Ingen respons fra AI');

      const sanitizedResponse = sanitizeInput(aiResponse);
      if (!sanitizedResponse) {
        throw new Error('Ugyldig respons fra AI');
      }
      
      // Update user message status to sent
      updateMessageStatus(userMessage.id, 'sent');

      // Save AI response
      const { data: aiMessage, error: assistantError } = await supabase
        .from('chat_messages')
        .insert({
          recording_id: recordingId,
          user_id: user.id,
          role: 'assistant',
          content: sanitizedResponse
        })
        .select()
        .single();

      if (assistantError) throw assistantError;
      addMessage({ ...aiMessage, status: 'sent' });

    } catch (err) {
      console.error('Error sending message:', err);
      if (messages.length > 0) {
        updateMessageStatus(messages[messages.length - 1].id, 'error');
      }
      throw new Error(err instanceof Error ? err.message : 'Kunne ikke sende melding');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="p-6 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          Få svar basert på møtets innhold og sammendrag
        </p>
      </div>

      <ChatMessageList
        messages={messages}
        hasMore={hasMore}
        isLoading={isLoading}
        isTyping={isTyping}
        onLoadMore={loadMoreMessages}
      />

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Still et spørsmål om møtet..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !newMessage.trim()}
            className={cn(
              "p-2 rounded-lg",
              isTyping || !newMessage.trim()
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-violet-600 text-white hover:bg-violet-700"
            )}
          >
            {isTyping ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}