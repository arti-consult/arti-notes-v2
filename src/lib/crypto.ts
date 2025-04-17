/**
 * Generate cryptographically secure random bytes using Web Crypto API
 */
export function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Convert bytes to base64 string
 */
export function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode.apply(null, Array.from(bytes)));
}

/**
 * Generate a cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const bytes = generateRandomBytes(length);
  return bytesToBase64(bytes);
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  return crypto.subtle.timingSafeEqual?.(
    new TextEncoder().encode(a),
    new TextEncoder().encode(b)
  ) ?? cryptoTimingSafeEqual(a, b);
}

/**
 * Fallback timing-safe comparison if crypto.subtle.timingSafeEqual is not available
 */
function cryptoTimingSafeEqual(a: string, b: string): boolean {
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}