export class TranscriptionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

export const TranscriptionErrorCodes = {
  // File-related errors
  INVALID_FILE: 'INVALID_FILE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_NOT_ACCESSIBLE: 'FILE_NOT_ACCESSIBLE',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  
  // API-related errors
  API_ERROR: 'API_ERROR',
  INVALID_API_KEY: 'INVALID_API_KEY',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // Processing errors
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  AUDIO_PROCESSING_ERROR: 'AUDIO_PROCESSING_ERROR',
  TRANSCRIPTION_FAILED: 'TRANSCRIPTION_FAILED',
  
  // Timing errors
  TIMEOUT: 'TIMEOUT',
  MAX_ATTEMPTS: 'MAX_ATTEMPTS',
  JOB_TIMEOUT: 'JOB_TIMEOUT',
  
  // Authentication/Authorization errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // Validation errors
  INVALID_LANGUAGE: 'INVALID_LANGUAGE',
  INVALID_OPTIONS: 'INVALID_OPTIONS',
  
  // General errors
  UNKNOWN: 'UNKNOWN',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const;

export type TranscriptionErrorCode = keyof typeof TranscriptionErrorCodes;

interface SaladApiError {
  message: string;
  code?: string;
  details?: any;
}

export function handleTranscriptionError(error: unknown): TranscriptionError {
  // If it's already a TranscriptionError, return it
  if (error instanceof TranscriptionError) {
    return error;
  }

  // Handle Salad API specific errors
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as SaladApiError;
    
    // Handle file size errors
    if (apiError.message.includes('more than 3GB')) {
      return new TranscriptionError(
        'File size exceeds the maximum limit of 3GB',
        TranscriptionErrorCodes.FILE_TOO_LARGE,
        apiError
      );
    }

    // Handle duration errors
    if (apiError.message.includes('2.5 hours')) {
      return new TranscriptionError(
        'Audio duration exceeds the maximum limit of 2.5 hours',
        TranscriptionErrorCodes.INVALID_FILE,
        apiError
      );
    }

    // Handle file access errors
    if (apiError.message.includes('can not be downloaded')) {
      return new TranscriptionError(
        'The audio file cannot be accessed',
        TranscriptionErrorCodes.FILE_NOT_ACCESSIBLE,
        apiError
      );
    }

    // Handle API key errors
    if (apiError.message.includes('API key')) {
      return new TranscriptionError(
        'Invalid or missing API key',
        TranscriptionErrorCodes.INVALID_API_KEY,
        apiError
      );
    }

    // Handle quota errors
    if (apiError.message.includes('quota') || apiError.message.includes('credits')) {
      return new TranscriptionError(
        'Account quota exceeded',
        TranscriptionErrorCodes.QUOTA_EXCEEDED,
        apiError
      );
    }

    // Handle processing errors
    if (apiError.message.includes('processing failed')) {
      return new TranscriptionError(
        'Audio processing failed',
        TranscriptionErrorCodes.AUDIO_PROCESSING_ERROR,
        apiError
      );
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Handle network errors
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return new TranscriptionError(
        'Network error occurred while communicating with the transcription service',
        TranscriptionErrorCodes.NETWORK_ERROR,
        { originalError: error }
      );
    }

    // Handle timeout errors
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return new TranscriptionError(
        'Request timed out',
        TranscriptionErrorCodes.TIMEOUT,
        { originalError: error }
      );
    }

    return new TranscriptionError(
      error.message,
      TranscriptionErrorCodes.UNKNOWN,
      { originalError: error }
    );
  }

  // Handle all other unknown errors
  return new TranscriptionError(
    'An unknown error occurred',
    TranscriptionErrorCodes.UNKNOWN,
    { originalError: error }
  );
}

// Helper functions for error checking
export function isQuotaError(error: TranscriptionError): boolean {
  return error.code === TranscriptionErrorCodes.QUOTA_EXCEEDED;
}

export function isNetworkError(error: TranscriptionError): boolean {
  return error.code === TranscriptionErrorCodes.NETWORK_ERROR;
}

export function isRetryableError(error: TranscriptionError): boolean {
  return [
    TranscriptionErrorCodes.NETWORK_ERROR,
    TranscriptionErrorCodes.TIMEOUT,
    TranscriptionErrorCodes.API_ERROR
  ].includes(error.code as TranscriptionErrorCodes);
}

export function getErrorMessage(error: TranscriptionError): string {
  switch (error.code) {
    case TranscriptionErrorCodes.FILE_TOO_LARGE:
      return 'The audio file is too large. Maximum size is 3GB.';
    case TranscriptionErrorCodes.QUOTA_EXCEEDED:
      return 'You have exceeded your transcription quota. Please upgrade your plan.';
    case TranscriptionErrorCodes.NETWORK_ERROR:
      return 'Connection error. Please check your internet connection and try again.';
    default:
      return error.message;
  }
}