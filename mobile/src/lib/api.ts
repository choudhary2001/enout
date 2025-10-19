import { mockApi } from '../mocks/mobileMocks';

// Always use mocks for Phase 1 (no network calls)
export const USE_MOCKS = true;

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
  // Auth APIs
  async requestEmailOtp(params: { email: string }): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.requestEmailOtp(params);
    } catch (error) {
      console.error('requestEmailOtp error:', error);
      throw error;
    }
  },

  async verifyEmail(params: { email: string; code: string }): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.verifyEmail(params);
    } catch (error) {
      console.error('verifyEmail error:', error);
      throw error;
    }
  },

  async resendOtp(params: { email: string }): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.resendOtp(params);
    } catch (error) {
      console.error('resendOtp error:', error);
      throw error;
    }
  },

  // Invite APIs
  async getInvite(): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.getInvite();
    } catch (error) {
      console.error('getInvite error:', error);
      throw error;
    }
  },

  async acceptInvite(): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.acceptInvite();
    } catch (error) {
      console.error('acceptInvite error:', error);
      throw error;
    }
  },

  // Tasks APIs
  async uploadId(file: any): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.uploadId(file);
    } catch (error) {
      console.error('uploadId error:', error);
      throw error;
    }
  },

  async saveRegistrationForm(values: any): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.saveRegistrationForm(values);
    } catch (error) {
      console.error('saveRegistrationForm error:', error);
      throw error;
    }
  },

  async requestPhoneOtp(): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.requestPhoneOtp();
    } catch (error) {
      console.error('requestPhoneOtp error:', error);
      throw error;
    }
  },

  async verifyPhone(params: { code: string }): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.verifyPhone(params);
    } catch (error) {
      console.error('verifyPhone error:', error);
      throw error;
    }
  },

  // Inbox APIs
  async listMessages(): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.listMessages();
    } catch (error) {
      console.error('listMessages error:', error);
      throw error;
    }
  },

  async getMessage(id: string): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.getMessage(id);
    } catch (error) {
      console.error('getMessage error:', error);
      throw error;
    }
  },

  async acknowledgeMessage(id: string): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.acknowledgeMessage(id);
    } catch (error) {
      console.error('acknowledgeMessage error:', error);
      throw error;
    }
  },

  // Schedule APIs
  async getSchedule(eventId: string): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.getSchedule(eventId);
    } catch (error) {
      console.error('getSchedule error:', error);
      throw error;
    }
  },

  // Profile APIs
  async getMe(): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.getMe();
    } catch (error) {
      console.error('getMe error:', error);
      throw error;
    }
  },

  async updateMe(partial: any): Promise<ApiResponse> {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    try {
      return await mockApi.updateMe(partial);
    } catch (error) {
      console.error('updateMe error:', error);
      throw error;
    }
  },

  // Helper to get current store state (for debugging and status checking)
  getStore() {
    if (!USE_MOCKS) throw new Error('Network API not implemented');
    return mockApi.getStore();
  },
};
