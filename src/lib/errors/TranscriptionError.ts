export class TranscriptionError extends Error {
  constructor(
    message: string,
    public readonly code: TranscriptionErrorCode,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

export enum TranscriptionErrorCode {
  // Request validation errors
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_FILE = 'INVALID_FILE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_ACCESS_ERROR = 'FILE_ACCESS_ERROR',
  
  // API errors
  API_ERROR = 'API_ERROR',
  INVALID_API_KEY = 'INVALID_API_KEY',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  // Processing errors
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  NO_SPEECH_DETECTED = 'NO_SPEECH_DETECTED',
  LANGUAGE_NOT_SUPPORTED = 'LANGUAGE_NOT_SUPPORTED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Unknown error
  UNKNOWN = 'UNKNOWN'
}

export function handleTranscriptionError(error: any): TranscriptionError {
  // Already a TranscriptionError
  if (error instanceof TranscriptionError) {
    return error;
  }

  // Handle SaladError
  if (error?.code === 'API_ERROR') {
    return new TranscriptionError(
      error.message || 'API request failed',
      TranscriptionErrorCode.API_ERROR,
      error.details
    );
  }

  // Handle network errors
  if (error.name === 'AbortError') {
    return new TranscriptionError(
      'Request timed out',
      TranscriptionErrorCode.TIMEOUT
    );
  }
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return new TranscriptionError(
      'Network error occurred',
      TranscriptionErrorCode.NETWORK_ERROR
    );
  }

  // Handle database errors
  if (error?.code?.startsWith('23')) {
    return new TranscriptionError(
      'Database error occurred',
      TranscriptionErrorCode.DATABASE_ERROR,
      error
    );
  }

  // Default unknown error
  return new TranscriptionError(
    error?.message || 'An unknown error occurred',
    TranscriptionErrorCode.UNKNOWN,
    error
  );
}

export function getUserFriendlyErrorMessage(error: TranscriptionError): string {
  switch (error.code) {
    case TranscriptionErrorCode.INVALID_REQUEST:
      return 'Ugyldig forespørsel. Sjekk at alle felter er korrekt formatert.';
    case TranscriptionErrorCode.INVALID_FILE:
      return 'Ugyldig fil. Sjekk at filen er i riktig format og ikke er skadet.';
    case TranscriptionErrorCode.FILE_TOO_LARGE:
      return 'Filen er for stor. Maksimal størrelse er 3GB.';
    case TranscriptionErrorCode.FILE_ACCESS_ERROR:
      return 'Kunne ikke lese filen. Sjekk at filen ikke er skadet.';
    case TranscriptionErrorCode.API_ERROR:
      return 'En feil oppstod under kommunikasjon med serveren. Prøv igjen senere.';
    case TranscriptionErrorCode.INVALID_API_KEY:
      return 'Ugyldig API-nøkkel. Kontakt support.';
    case TranscriptionErrorCode.QUOTA_EXCEEDED:
      return 'Du har nådd kvoten din. Oppgrader abonnementet for å fortsette.';
    case TranscriptionErrorCode.PROCESSING_FAILED:
      return 'Kunne ikke behandle lydfilen. Sjekk at filen inneholder tale og prøv igjen.';
    case TranscriptionErrorCode.NO_SPEECH_DETECTED:
      return 'Ingen tale oppdaget i lydfilen. Sjekk at filen inneholder tale.';
    case TranscriptionErrorCode.LANGUAGE_NOT_SUPPORTED:
      return 'Språket støttes ikke. Prøv med et annet språk.';
    case TranscriptionErrorCode.NETWORK_ERROR:
      return 'Nettverksfeil. Sjekk internettforbindelsen din og prøv igjen.';
    case TranscriptionErrorCode.TIMEOUT:
      return 'Forespørselen tok for lang tid. Prøv igjen senere.';
    case TranscriptionErrorCode.DATABASE_ERROR:
      return 'En databasefeil oppstod. Prøv igjen senere.';
    default:
      return error.message || 'En ukjent feil oppstod. Prøv igjen senere.';
  }
}