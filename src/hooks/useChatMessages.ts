import { useState, useEffect } from 'react';


const MESSAGES_PER_PAGE = 20;

export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  status?: MessageStatus;
}

export function useChatMessages(recordingId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (recordingId) {
      fetchInitialMessages();
    }
  }, [recordingId]);

  const fetchInitialMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('recording_id', recordingId)
        .order('created_at', { ascending: false })
        .limit(MESSAGES_PER_PAGE);

      if (fetchError) throw fetchError;

      setMessages(data?.reverse() || []);
      setHasMore(data?.length === MESSAGES_PER_PAGE);
      setPage(1);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Could not fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('recording_id', recordingId)
        .order('created_at', { ascending: false })
        .range(page * MESSAGES_PER_PAGE, (page + 1) * MESSAGES_PER_PAGE - 1);

      if (fetchError) throw fetchError;

      if (data) {
        setMessages(prev => [...data.reverse(), ...prev]);
        setHasMore(data.length === MESSAGES_PER_PAGE);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
      setError(err instanceof Error ? err.message : 'Could not load more messages');
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (message: ChatMessage, status?: MessageStatus) => {
    setMessages(prev => [...prev, { ...message, status }]);
  };

  const updateMessageStatus = (messageId: string, status: MessageStatus) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

  return {
    messages,
    isLoading,
    error,
    hasMore,
    loadMoreMessages,
    addMessage,
    updateMessageStatus
  };
}