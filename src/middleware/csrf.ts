import { generateSecureToken, timingSafeEqual } from '@/lib/crypto';

// CSRF token length in bytes
const TOKEN_LENGTH = 32;

/**
 * Generate a cryptographically secure nonce
 */
export function generateNonce(): string {
  return generateSecureToken(TOKEN_LENGTH);
}

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return generateSecureToken(TOKEN_LENGTH);
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false;
  }
  
  return timingSafeEqual(token, storedToken);
}