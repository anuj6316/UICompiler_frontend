/**
 * Centralized Environment Configuration
 * 
 * This file provides a single source of truth for all environment variables used in the application.
 * It ensures type safety and provides fallback values where appropriate.
 */

export const env = {
  // Frontend Variables (Must be prefixed with VITE_)
  // Accessible in the browser
  appName: import.meta.env.VITE_APP_NAME || 'UICompiler',
  apiUrl: (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, ''),
  
  // Environment Flags
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  // Backend/Server Variables (Only accessible in Node.js environments)
  // These will be undefined in the browser to prevent leaking secrets
  geminiApiKey: typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined,
  appUrl: typeof process !== 'undefined' ? process.env.APP_URL : undefined,
} as const;

export default env;
