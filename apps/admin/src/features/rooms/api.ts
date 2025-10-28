import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { env } from '@/lib/env';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_auth_token');
}

export interface RoomFilters {
  status: string[];
  category: string;
  search: string;
  sort: string;
  page: number;
  pageSize: number;
}

export interface Room {
  id: string;
  eventId: string;
  roomNo: string;
  category: string;
  maxGuests: 1 | 2 | 3;
  createdAt: string;
  updatedAt: string;
  assignments: {
    slot: 1 | 2 | 3;
    attendeeId: string | null;
    attendee?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  }[];
  // derived
  status: 'empty' | 'partial' | 'full';
}

export interface AttendeeLite {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'accepted' | 'registered' | 'invited' | 'email_verified';
  // Helper: which room/slot currently assigned (for badge)
  assigned?: { roomNo: string; slot: 1 | 2 | 3 } | null;
}

// Legacy interface for backward compatibility
export interface RoomWithAssignments {
  id: string;
  eventId: string;
  roomNo: string;
  category: string;
  maxGuests: number;
  status: 'Empty' | 'Partial' | 'Full';
  assignments: {
    slot: number;
    attendeeId: string;
    attendee: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  }[];
}

export interface RoomsResponse {
  rooms: Room[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EligibleAttendee {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  status: 'accepted' | 'registered';
}

export interface AddRoomRequest {
  roomNo: string;
  category: string;
  maxGuests: 1 | 2 | 3;
}

export interface AssignRoomRequest {
  roomId: string;
  slot: 1 | 2 | 3;
  attendeeId: string | null;
}

export interface ClearAssignmentRequest {
  roomId: string;
  slot: 1 | 2 | 3;
}

export interface RoomAssignmentRequest {
  roomId: string;
  slot: number;
  attendeeId: string | null;
}

export interface RoomAssignmentResponse {
  success: boolean;
  alreadyAssigned?: {
    roomId: string;
    slot: number;
  };
}


// Query keys
export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (eventId: string, filters: RoomFilters) => [...roomKeys.lists(), eventId, filters] as const,
  eligibleAttendees: (eventId: string, search?: string) => [...roomKeys.all, 'eligible', eventId, search] as const,
};

// Queries
export function useRooms(eventId: string, filters: RoomFilters) {
  return useQuery({
    queryKey: roomKeys.list(eventId, filters),
    queryFn: async (): Promise<RoomsResponse> => {
      const params = new URLSearchParams();

      filters.status.forEach(status => params.append('status[]', status));
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('q', filters.search);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', filters.page.toString());
      params.append('pageSize', filters.pageSize.toString());

      const response = await fetch(`${env.apiUrl}/api/events/${eventId}/rooms?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
}

export function useEligibleAttendees(eventId: string, search?: string) {
  return useQuery({
    queryKey: roomKeys.eligibleAttendees(eventId, search),
    queryFn: async (): Promise<EligibleAttendee[]> => {
      const params = new URLSearchParams();
      params.append('status', 'accepted,registered');
      if (search) params.append('q', search);

      const url = `${env.apiUrl}/api/events/${eventId}/attendees?${params.toString()}`;
      console.log('API: Fetching eligible attendees from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch eligible attendees');
      }

      const data = await response.json();
      console.log('API: Received eligible attendees:', data.length, data);
      return data;
    },
    staleTime: 60000, // 1 minute
  });
}

// Mutations
export function useRoomAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, assignment }: { eventId: string; assignment: RoomAssignmentRequest }): Promise<RoomAssignmentResponse> => {
      const response = await fetch(`${env.apiUrl}/api/events/${eventId}/rooms/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignment),
      });

      if (!response.ok) {
        throw new Error('Failed to assign room');
      }

      return response.json();
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate all room queries for this event
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roomKeys.eligibleAttendees(eventId) });
    },
  });
}


export function useRoomsExport() {
  return useMutation({
    mutationFn: async ({ eventId, filters }: { eventId: string; filters: Record<string, any> }): Promise<Blob> => {
      const params = new URLSearchParams();

      if (filters.status?.length) {
        filters.status.forEach((status: string) => params.append('status[]', status));
      }
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('q', filters.search);

      const response = await fetch(`${env.apiUrl}/api/events/${eventId}/rooms/export?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to export rooms');
      }

      return response.blob();
    },
  });
}

// New table-specific mutations
export function useAddRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, room }: { eventId: string; room: AddRoomRequest }): Promise<Room> => {
      const response = await fetch(`${env.apiUrl}/api/events/${eventId}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(room),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      return response.json();
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}

export function useAssignRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, assignment }: { eventId: string; assignment: AssignRoomRequest }): Promise<void> => {
      const url = `${env.apiUrl}/api/events/${eventId}/rooms/assign`;
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log('Assigning room:', { url, assignment, hasToken: !!token });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          roomId: assignment.roomId,
          slot: assignment.slot,
          attendeeId: assignment.attendeeId,
        }),
      });

      console.log('Assignment response:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Failed to assign room: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Assignment failed:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          console.error('Assignment failed:', errorText);
        }
        throw new Error(errorMessage);
      }
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roomKeys.eligibleAttendees(eventId) });
    },
  });
}

export function useClearAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, assignment }: { eventId: string; assignment: ClearAssignmentRequest }): Promise<void> => {
      const response = await fetch(`${env.apiUrl}/api/events/${eventId}/rooms/${assignment.roomId}/unassign`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slot: assignment.slot,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear assignment');
      }
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roomKeys.eligibleAttendees(eventId) });
    },
  });
}

export function useDeleteRooms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, roomIds }: { eventId: string; roomIds: string[] }): Promise<void> => {
      // TODO: Implement delete rooms endpoint in the backend
      // For now, delete from localStorage
      const storageKey = `rooms-${eventId}`;
      const existingRooms = localStorage.getItem(storageKey);
      const rooms: Room[] = existingRooms ? JSON.parse(existingRooms) : [];

      const updatedRooms = rooms.filter(room => !roomIds.includes(room.id));
      localStorage.setItem(storageKey, JSON.stringify(updatedRooms));
      window.dispatchEvent(new Event('roomsChanged'));

      await new Promise(resolve => setTimeout(resolve, 100));
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate all room queries for this event
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roomKeys.eligibleAttendees(eventId) });
    },
  });
}
