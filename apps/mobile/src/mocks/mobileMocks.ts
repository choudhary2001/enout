// In-memory mock store with simulated latency
interface MockStore {
  lastEmail: string | null;
  lastCode: string | null;
  attemptCount: number;
}

const store: MockStore = {
  lastEmail: null,
  lastCode: '123456', // Fixed valid code for testing
  attemptCount: 0,
};

// Simulate network latency
const simulateLatency = () => 
  new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));

export const mockApi = {
  async requestEmailOtp({ email }: { email: string }) {
    await simulateLatency();
    
    store.lastEmail = email;
    store.attemptCount = 0;
    
    // Only @brevo.com emails are valid
    if (email.endsWith('@brevo.com')) {
      return {
        ok: true,
        message: 'OTP sent successfully',
      };
    }
    
    return {
      ok: false,
      inviteStatus: 'not_found',
      message: 'Email not found in invite list',
    };
  },

  async verifyEmail({ email, code }: { email: string; code: string }) {
    await simulateLatency();
    
    store.attemptCount++;
    
    // Only accept '123456' as valid code
    if (code === '123456') {
      return {
        ok: true,
        message: 'Email verified successfully',
        token: 'mock-jwt-token',
        user: {
          email,
          id: 'mock-user-id',
          role: 'guest',
        },
      };
    }
    
    throw new Error('Invalid code');
  },

  async resendOtp({ email }: { email: string }) {
    await simulateLatency();
    
    store.lastEmail = email;
    store.attemptCount = 0;
    
    // Same logic as requestEmailOtp
    if (email.endsWith('@brevo.com')) {
      return {
        ok: true,
        message: 'OTP resent successfully',
      };
    }
    
    return {
      ok: false,
      inviteStatus: 'not_found',
      message: 'Email not found in invite list',
    };
  },

  // Helper to get current state (for debugging)
  getStore() {
    return { ...store };
  },
};
