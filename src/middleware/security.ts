import { generateNonce } from './csrf';

/**
 * Generate Content Security Policy headers
 */
export function getSecurityHeaders() {
  // Generate nonce for inline scripts
  const scriptNonce = generateNonce();
  
  return {
    // Content Security Policy
    'Content-Security-Policy': [
      // Default to nothing allowed
      "default-src 'none'",
      // Allow scripts from our domain, Supabase, and FFmpeg CDN
      `script-src 'self' 'unsafe-eval' 'nonce-${scriptNonce}' https://*.supabase.co https://cdn.tailwindcss.com https://cdn.jsdelivr.net`,
      // Allow styles from our domain and inline styles needed for Tailwind
      "style-src 'self' 'unsafe-inline' https://rsms.me/inter/inter.css https://cdn.tailwindcss.com",
      // Allow images from our domain and Unsplash
      "img-src 'self' https://images.unsplash.com data:",
      // Allow fonts
      "font-src 'self' https://rsms.me/inter/",
      // Allow audio for our recordings and WebAssembly
      "media-src 'self' blob:",
      // Allow WebAssembly and workers
      "worker-src 'self' blob: https://cdn.jsdelivr.net",
      "child-src 'self' blob:",
      // Allow connection to Supabase, Salad API, and AWS
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.salad.com https://*.amazonaws.com https://cdn.jsdelivr.net",
      // Allow frames for auth providers
      "frame-src 'self' https://*.supabase.co",
      // Enable strict dynamic for better script control
      "'strict-dynamic'",
    ].join('; '),
    
    // Prevent browsers from interpreting files as a different MIME type
    'X-Content-Type-Options': 'nosniff',
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Enable browser XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Only send referrer header to same origin
    'Referrer-Policy': 'same-origin',
    
    // Disable browser features we don't need
    'Permissions-Policy': [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=(self)', // Allow microphone for recording
      'payment=()',
      'usb=()'
    ].join(', ')
  };
}