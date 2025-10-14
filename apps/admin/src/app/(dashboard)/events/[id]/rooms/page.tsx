'use client';

import { useState, useEffect } from 'react';
import { RoomTable } from '@/components/rooms/RoomTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Room } from '@/features/rooms/api';

export default function RoomsPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const [localRooms, setLocalRooms] = useState<Room[]>([]);

  // Fetch rooms - using local storage for now since endpoint doesn't exist
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms', params.id],
    queryFn: async () => {
      // Load from localStorage
      const stored = localStorage.getItem(`rooms-${params.id}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored rooms:', e);
        }
      }
      return [];
    },
  });

  // Sync local rooms with query data
  useEffect(() => {
    setLocalRooms(rooms);
  }, [rooms]);

  // Listen for room changes
  useEffect(() => {
    const handleRoomChange = () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', params.id] });
    };

    window.addEventListener('roomsChanged', handleRoomChange);
    return () => window.removeEventListener('roomsChanged', handleRoomChange);
  }, [params.id, queryClient]);

  // Fetch all guests from the same endpoint as guest list (max pageSize is 100)
  const { data: allGuests = [], isLoading: attendeesLoading } = useQuery({
    queryKey: ['guests', params.id, { all: true }],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3006/api/events/${params.id}/invites?page=1&pageSize=100`);
      if (!response.ok) throw new Error('Failed to fetch guests');
      const data = await response.json();
      return data.data || [];
    },
  });

  // Use all guests for room assignment (same as guest list)
  const eligibleAttendees = Array.isArray(allGuests) ? allGuests : [];

  return (
    <RoomTable
      rooms={localRooms}
      eligibleAttendees={eligibleAttendees}
      eventId={params.id}
      isLoading={roomsLoading || attendeesLoading}
    />
  );
}