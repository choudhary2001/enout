import { mockApi } from '../mocks/mobileMocks';

// Always use mocks for Phase 1 (no network calls)
export const USE_MOCKS = true;

interface EmailOtpRequest {
  email: string;
}

interface VerifyEmailRequest {
  email: string;
  code: string;
}

interface ApiResponse<T = unknown> {
  ok: boolean;
  message?: string;
  data?: T;
  inviteStatus?: string;
  token?: string;
  user?: {
    email: string;
    id: string;
    role: string;
  };
}

// API adapter that calls mocks directly (no fetch)
export const api = {
  async requestEmailOtp(params: EmailOtpRequest): Promise<ApiResponse> {
    if (!USE_MOCKS) {
      // Future: Add real API call here
      throw new Error('Network API not implemented');
    }
    
    try {
      const result = await mockApi.requestEmailOtp(params);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('requestEmailOtp error:', error);
      throw error;
    }
  },

  async verifyEmail(params: VerifyEmailRequest): Promise<ApiResponse> {
    if (!USE_MOCKS) {
      // Future: Add real API call here
      throw new Error('Network API not implemented');
    }
    
    try {
      const result = await mockApi.verifyEmail(params);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('verifyEmail error:', error);
      throw error;
    }
  },

  async resendOtp(params: EmailOtpRequest): Promise<ApiResponse> {
    if (!USE_MOCKS) {
      // Future: Add real API call here
      throw new Error('Network API not implemented');
    }
    
    try {
      const result = await mockApi.resendOtp(params);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('resendOtp error:', error);
      throw error;
    }
  },
};
