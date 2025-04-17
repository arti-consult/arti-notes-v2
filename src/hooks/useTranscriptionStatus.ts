import { useState, useEffect, useCallback, useRef } from 'react';
import { startTranscription, checkTranscriptionStatus } from '@/services/transcriptionService';
import { toast } from 'sonner';
interface TranscriptionStatusConfig {
  recordingId: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}
export function useTranscriptionStatus(config: TranscriptionStatusConfig | null) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const pollingTimeoutRef = useRef<number>();
  const isMounted = useRef(true);
  const attempts = useRef(0);
  const lastCheckTime = useRef(0);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const checkStatus = useCallback(async () => {
    if (!configRef.current?.recordingId || !isMounted.current) return;

    // Enforce minimum interval between checks
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime.current;
    if (timeSinceLastCheck < transcriptionConfig.polling.interval) {
      setTimeout(checkStatus, transcriptionConfig.polling.interval - timeSinceLastCheck);
      return;
    }

    lastCheckTime.current = now;

    try {
      const response = await checkTranscriptionStatus(configRef.current.recordingId);
      attempts.current = 0; // Reset attempts on successful check
      
      const newProgress = response.progress || 0;
      setProgress(newProgress);
      if (configRef.current.onProgress) {
        configRef.current.onProgress(newProgress);
      }

      // Map API status to our internal status
      if (response.status === 'completed' && response.result) {
        setStatus('completed');
        stopPolling();
        if (configRef.current.onComplete) {
          configRef.current.onComplete();
        }
        toast.success('Transkribering fullført');
      } else if (response.status === 'failed') {
        setError(response.error || 'Transkribering feilet');
        stopPolling();
        if (configRef.current.onError) {
          configRef.current.onError(new Error(response.error || 'Transkribering feilet'));
        }
        toast.error(response.error || 'Transkribering feilet');
      } else {
        // Schedule next check with exponential backoff
        const baseDelay = transcriptionConfig.polling.interval;
        const backoffFactor = Math.min(Math.pow(1.5, attempts.current), 5);
        const nextDelay = Math.min(baseDelay * backoffFactor, 30000); // Max 30 seconds
        setTimeout(checkStatus, nextDelay);
      }
    } catch (err) {
      console.error('Error checking transcription status:', err);
      attempts.current++;

      if (attempts.current >= transcriptionConfig.polling.maxAttempts) {
        const errorMessage = err instanceof Error ? err.message : 'Kunne ikke sjekke transkriberingsstatus';
        setStatus('error');
        setError(errorMessage);
        stopPolling();
        if (configRef.current.onError) {
          configRef.current.onError(err instanceof Error ? err : new Error(errorMessage));
        }
        toast.error(errorMessage);
      } else {
        // Exponential backoff for errors
        const baseDelay = transcriptionConfig.polling.interval;
        const backoffFactor = Math.min(Math.pow(2, attempts.current), 10);
        const nextDelay = Math.min(baseDelay * backoffFactor, 60000); // Max 1 minute
        setTimeout(checkStatus, nextDelay);
      }
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = undefined;
    }
  }, []);

  const retryTranscription = useCallback(async () => {
    if (!configRef.current?.recordingId || retryCount >= 3) return;
    
    try {
      setStatus('processing');
      setProgress(0);
      setError(null);
      setRetryCount(prev => prev + 1);
      
      await startTranscription(configRef.current.recordingId);
      checkStatus();
    } catch (error) {
      console.error('Error retrying transcription:', error);
      setStatus('error');
      setError(error instanceof Error ? error.message : 'Kunne ikke starte transkribering på nytt');
    }
  }, [retryCount, checkStatus]);

  useEffect(() => {
    isMounted.current = true;
    lastCheckTime.current = 0;
    attempts.current = 0;
    
    if (configRef.current?.recordingId) {
      setStatus('processing');
      setProgress(0);
      setError(null);
      setRetryCount(0);
      
      // Start transcription if not already started
      startTranscription(configRef.current.recordingId).catch(error => {
        console.error('Error starting transcription:', error);
        setStatus('error');
        setError(error.message);
        if (configRef.current.onError) {
          configRef.current.onError(error);
        }
      });

      // Initial check
      checkStatus();

      // Set timeout for maximum duration
      const maxDurationTimeout = setTimeout(() => {
        if (isMounted.current && status !== 'completed') {
          stopPolling();
          setStatus('error');
          setError('Transkribering tok for lang tid');
          if (configRef.current.onError) {
            configRef.current.onError(new Error('Transkribering tok for lang tid'));
          }
          toast.error('Transkribering tok for lang tid');
        }
      }, transcriptionConfig.polling.timeout);

      return () => {
        isMounted.current = false;
        stopPolling();
        clearTimeout(maxDurationTimeout);
      };
    }
  }, [status, stopPolling, checkStatus]);

  return {
    status,
    progress,
    error,
    retryCount,
    canRetry: retryCount < 3,
    retry: retryTranscription,
    isLoading: status === 'processing',
    isComplete: status === 'completed',
    isError: status === 'error'
  };
}