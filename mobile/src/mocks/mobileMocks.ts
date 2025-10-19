// In-memory mock store with simulated latency
import { mockEvent, mockAttendee, mockMessages, mockSchedule } from './seeds';

interface MockStore {
  // Auth state
  lastEmail: string | null;
  lastCode: string | null;
  attemptCount: number;
  authToken: string | null;
  authEmail: string | null;
  
  // Invite state
  inviteStatus: 'pending' | 'accepted' | 'not_found';
  
  // Tasks state
  tasks: {
    idUpload: 'pending' | 'done';
    form: 'pending' | 'done';
    phone: 'pending' | 'done';
  };
  
  // Phone OTP
  phoneCode: string | null;
  
  // Attendee data
  attendee: typeof mockAttendee;
  
  // Messages
  messages: typeof mockMessages;
}

const store: MockStore = {
  // Auth state
  lastEmail: null,
  lastCode: '123456', // Fixed valid code for testing
  attemptCount: 0,
  authToken: null,
  authEmail: null,
  
  // Invite state
  inviteStatus: 'pending',
  
  // Tasks state
  tasks: {
    idUpload: 'pending',
    form: 'pending',
    phone: 'pending',
  },
  
  // Phone OTP
  phoneCode: null,
  
  // Attendee data
  attendee: { ...mockAttendee },
  
  // Messages
  messages: [...mockMessages],
};

// Simulate network latency
const simulateLatency = () => 
  new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));

export const mockApi = {
  async requestEmailOtp({ email }: { email: string }) {
    await simulateLatency();
    
    console.log('Mock API: requestEmailOtp called with email:', email);
    console.log('Mock API: email ends with @brevo.com?', email.endsWith('@brevo.com'));
    
    store.lastEmail = email;
    store.attemptCount = 0;
    
    // Only @brevo.com emails are valid
    if (email.endsWith('@brevo.com')) {
      console.log('Mock API: Email accepted, returning success');
      return {
        ok: true,
        message: 'OTP sent successfully',
      };
    }
    
    console.log('Mock API: Email rejected, returning not_found');
    return {
      ok: false,
      inviteStatus: 'not_found',
      message: 'Email not found in invite list',
    };
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

  // Auth & Invite APIs
  async verifyEmail({ email, code }: { email: string; code: string }) {
    await simulateLatency();
    
    console.log('Mock API: verifyEmail called with email:', email, 'code:', code);
    console.log('Mock API: Current inviteStatus:', store.inviteStatus);
    
    store.attemptCount++;
    
    // Only accept '123456' as valid code
    if (code === '123456') {
      store.authToken = 'mock-jwt-token';
      store.authEmail = email;
      store.attendee.email = email;
      
      // Set invite status to 'pending' if first time
      if (store.inviteStatus === 'not_found') {
        store.inviteStatus = 'pending';
        console.log('Mock API: Setting inviteStatus to pending');
      }
      
      const response = {
        ok: true,
        message: 'Email verified successfully',
        token: store.authToken,
        inviteStatus: store.inviteStatus,
        attendee: store.attendee,
      };
      
      console.log('Mock API: Returning response:', response);
      return response;
    }
    
    throw new Error('Invalid code');
  },

  async getInvite() {
    await simulateLatency();
    return {
      event: mockEvent,
      inviteStatus: store.inviteStatus,
    };
  },

  async acceptInvite() {
    await simulateLatency();
    store.inviteStatus = 'accepted';
    return {
      ok: true,
      message: 'Invite accepted successfully',
    };
  },

  // Tasks APIs
  async uploadId(file: any) {
    await simulateLatency();
    store.tasks.idUpload = 'done';
    store.attendee.idCardUrl = 'https://example.com/id-card.jpg';
    return {
      fileUrl: 'https://example.com/id-card.jpg',
    };
  },

  async saveRegistrationForm(values: any) {
    await simulateLatency();
    store.tasks.form = 'done';
    
    // Map registration form fields to attendee fields
    const mappedValues = {
      firstName: values.name || '',
      lastName: values.surname || '',
      workEmail: values.workEmail || '', // Work email
      dietaryRequirements: values.mealPreference || '',
      location: values.location || '',
      gender: values.gender || '',
      // Note: company and emergencyContact are not collected in the form, so they remain empty
    };
    
    store.attendee = { ...store.attendee, ...mappedValues };
    return {
      ok: true,
      message: 'Registration form saved',
    };
  },

  async requestPhoneOtp({ phone }: { phone: string }) {
    await simulateLatency();
    store.phoneCode = '654321';
    store.attendee.phone = phone; // Save the phone number when OTP is requested
    return {
      ok: true,
      message: 'Phone OTP sent',
    };
  },

  async verifyPhone({ code }: { code: string }) {
    await simulateLatency();
    
    if (code === '654321') {
      store.tasks.phone = 'done';
      return {
        ok: true,
        message: 'Phone verified successfully',
      };
    }
    
    throw new Error('Invalid phone code');
  },

  // Inbox APIs
  async listMessages() {
    await simulateLatency();
    return {
      items: store.messages.map(msg => ({
        id: msg.id,
        subject: msg.subject,
        snippet: msg.snippet,
        sentAt: msg.sentAt,
        unread: msg.unread,
        attachmentsCount: msg.attachmentsCount,
        sender: msg.sender,
        avatar: msg.avatar,
      })),
    };
  },

  async getMessage(id: string) {
    await simulateLatency();
    const message = store.messages.find(msg => msg.id === id);
    if (!message) {
      throw new Error('Message not found');
    }
    return {
      subject: message.subject,
      text: message.text,
      attachments: message.attachments,
    };
  },

  async acknowledgeMessage(id: string) {
    await simulateLatency();
    const message = store.messages.find(msg => msg.id === id);
    if (message) {
      message.unread = false;
    }
    return { ok: true };
  },

  // Schedule APIs
  async getSchedule(eventId: string) {
    await simulateLatency();
    return mockSchedule;
  },

  // Profile APIs
  async getMe() {
    await simulateLatency();
    return store.attendee;
  },

  async updateMe(partial: any) {
    await simulateLatency();
    store.attendee = { ...store.attendee, ...partial };
    return {
      ok: true,
      message: 'Profile updated successfully',
    };
  },
};
