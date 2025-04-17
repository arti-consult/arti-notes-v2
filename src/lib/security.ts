import DOMPurify from 'dompurify';
import { supabase } from './supabase';

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  // Remove any HTML/script content
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [] // No attributes allowed
  });

  // Additional sanitization
  return sanitized
    .trim()
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, ''); // Remove data: protocol
}

/**
 * Validates recording access for user
 */
export async function validateRecordingAccess(
  recordingId: string, 
  userId: string
): Promise<boolean> {
  if (!recordingId || !userId) return false;

  try {
    const { data, error } = await supabase
      .from('recordings')
      .select('user_id')
      .eq('id', recordingId)
      .single();

    if (error || !data) return false;
    return data.user_id === userId;
  } catch {
    return false;
  }
}

/**
 * Validates file type and size
 */
export function validateFile(file: File, allowedTypes: string[], maxSize: number): boolean {
  if (!file) return false;
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return false;
  }

  // Check file size (in bytes)
  if (file.size > maxSize) {
    return false;
  }

  return true;
}

/**
 * Sanitizes and validates a filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}