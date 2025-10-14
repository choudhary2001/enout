import { MessageType } from '@enout/shared';
import { env } from '@/lib/env';

export interface MessageQueryParams {
  q?: string;
  status?: 'draft' | 'sent' | 'scheduled';
  sort?: 'createdAt' | 'sentAt' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface MessageResponse {
  data: MessageType[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AttachmentUploadResponse {
  uploadUrl: string;
  fileUrl: string;
}

export interface ScheduleRequest {
  scheduledAt: string;
}

class MessagesApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'MessagesApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${env.apiUrl}${endpoint}`;
  
  console.log('Messages API: apiRequest called with endpoint:', endpoint, 'url:', url);
  
  // Get auth token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      const errorMessage = (errorData as { message?: string })?.message || `HTTP ${response.status}`;
      throw new MessagesApiError(errorMessage, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof MessagesApiError) {
      throw error;
    }
    
    // On API failure, show toast
    if (typeof window !== 'undefined') {
      // Import toast dynamically to avoid SSR issues
      import('@/hooks/use-toast').then(({ toast }) => {
        toast({
          title: 'Backend unavailable',
          description: 'Unable to connect to the API server.',
          variant: 'destructive',
        });
      });
    }
    
    throw new MessagesApiError('Network error', 0, error);
  }
}

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

export const messagesApi = {
  // Get messages with query parameters
  getMessages: async (eventId: string, params: MessageQueryParams = {}): Promise<MessageResponse> => {
    const queryString = buildQueryString(params);
    const endpoint = `/events/${eventId}/messages${queryString ? `?${queryString}` : ''}`;
    console.log('Messages API: getMessages called with eventId:', eventId, 'params:', params, 'endpoint:', endpoint);
    return apiRequest<MessageResponse>(endpoint);
  },

  // Get single message
  getMessage: async (eventId: string, messageId: string): Promise<MessageType> => {
    return apiRequest<MessageType>(`/events/${eventId}/messages/${messageId}`);
  },

  // Create draft message
  createMessage: async (eventId: string, message: Partial<MessageType>): Promise<MessageType> => {
    return apiRequest<MessageType>(`/events/${eventId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  // Update message
  updateMessage: async (eventId: string, messageId: string, message: Partial<MessageType>): Promise<MessageType> => {
    return apiRequest<MessageType>(`/events/${eventId}/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify(message),
    });
  },

  // Delete message (only if draft)
  deleteMessage: async (eventId: string, messageId: string): Promise<void> => {
    return apiRequest<void>(`/events/${eventId}/messages/${messageId}`, {
      method: 'DELETE',
    });
  },

  // Send message now
  sendMessage: async (eventId: string, messageId: string): Promise<MessageType> => {
    return apiRequest<MessageType>(`/events/${eventId}/messages/${messageId}/send`, {
      method: 'POST',
    });
  },

  // Schedule message
  scheduleMessage: async (eventId: string, messageId: string, schedule: ScheduleRequest): Promise<MessageType> => {
    return apiRequest<MessageType>(`/events/${eventId}/messages/${messageId}/schedule`, {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  },

  // Resend message
  resendMessage: async (eventId: string, messageId: string): Promise<MessageType> => {
    return apiRequest<MessageType>(`/events/${eventId}/messages/${messageId}/resend`, {
      method: 'POST',
    });
  },

  // Upload attachment
  uploadAttachment: async (eventId: string, messageId: string, file: File): Promise<AttachmentUploadResponse> => {
    // Step 1: Get upload URL
    const uploadResponse = await apiRequest<AttachmentUploadResponse>(`/events/${eventId}/messages/${messageId}/attachments`, {
      method: 'POST',
      body: JSON.stringify({ fileName: file.name, fileSize: file.size, fileType: file.type }),
    });

    // Step 2: Upload file to presigned URL
    await fetch(uploadResponse.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    return uploadResponse;
  },
};

export { MessagesApiError };
