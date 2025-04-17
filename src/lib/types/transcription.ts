export interface Transcription {
  id: string;
  meeting_id: string;
  status: TranscriptionStatus;
  language: string;
  text?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

export type TranscriptionStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface TranscriptionRequest {
  meeting_id: string;
  language: string;
}

export interface TranscriptionResponse {
  id: string;
  status: TranscriptionStatus;
  text?: string;
  error?: string;
}

export interface TranscriptionProgress {
  status: TranscriptionStatus;
  progress?: number;
  error?: string;
}

export interface TranscriptionConfig {
  polling: {
    interval: number;
    maxAttempts: number;
    timeout: number;
  };
  audio: {
    maxSize: number;
    allowedTypes: string[];
    preferredType: string;
  };
  language: {
    default: string;
    supported: string[];
  };
} 