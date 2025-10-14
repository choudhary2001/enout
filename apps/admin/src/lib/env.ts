/**
 * Environment configuration utilities
 */

export const env = {
  // API configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3006',
  
  // Development mode
  isDev: process.env.NODE_ENV === 'development',
} as const;