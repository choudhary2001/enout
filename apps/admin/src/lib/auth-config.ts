/**
 * Authentication configuration for admin dashboard
 */

export const ADMIN_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@enout.in',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'enout123',
};

export const AUTH_CONFIG = {
  tokenKey: 'admin_auth_token',
  refreshTokenKey: 'admin_refresh_token',
  adminEmailKey: 'admin_email',
};

