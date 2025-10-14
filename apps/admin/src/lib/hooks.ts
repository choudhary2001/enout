import { useQuery } from '@tanstack/react-query';
import { api } from './api';

// Hook to fetch all events
export function useEvents() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: api.getEvents,
    retry: (failureCount, error: any) => {
      // Retry up to 3 times for 429 errors, 1 time for others
      if (error?.status === 429) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Debug logging
  console.log('useEvents hook:', { data, error, isLoading });

  return {
    events: data,
    isLoading,
    error,
    mutate: refetch,
  };
}

// Hook to fetch a specific event
export function useEvent(eventId: string | null) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventId ? api.getEventById(eventId) : null,
    enabled: !!eventId,
    retry: (failureCount, error: any) => {
      // Retry up to 3 times for 429 errors, 1 time for others
      if (error?.status === 429) {
        return failureCount < 3;
      }
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    event: data,
    isLoading,
    error,
    mutate: refetch,
  };
}
