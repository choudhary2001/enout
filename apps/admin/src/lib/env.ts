/**
 * Environment configuration utilities
 */

export const env = {
  // API configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.enout.app',

  // Development mode
  isDev: process.env.NODE_ENV === 'development',

  // Admin credentials
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@enout.in',
  adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'enout123',
} as const;