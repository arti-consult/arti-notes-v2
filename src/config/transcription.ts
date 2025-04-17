export const transcriptionConfig = {
  polling: {
    interval: 5000, // 5 seconds between checks
    maxAttempts: 180, // 30 minutes total
    timeout: 1800000 // 30 minutes in milliseconds
  },
  audio: {
    maxSize: 100 * 1024 * 1024, // 100MB max file size
    allowedTypes: [
      'audio/webm',   // WebM Audio (primary format)
      'audio/webm;codecs=opus' // WebM with Opus codec
    ],
    preferredType: 'audio/webm;codecs=opus'
  },
  language: {
    default: 'nb', // Norwegian Bokmål
    supported: ['nb', 'en'] // Only Norwegian and English for now
  }
} as const;

// Helper types
export type SupportedLanguage = typeof transcriptionConfig.language.supported[number];

// Helper functions
export function isLanguageSupported(lang: string): lang is SupportedLanguage {
  return transcriptionConfig.language.supported.includes(lang as SupportedLanguage);
}

export function validateAudioFile(file: File): boolean {
  return (
    file.size <= transcriptionConfig.audio.maxSize &&
    transcriptionConfig.audio.allowedTypes.includes(file.type)
  );
}