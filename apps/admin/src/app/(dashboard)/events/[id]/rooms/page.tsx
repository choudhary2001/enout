'use client';

import { RoomTable } from '@/components/rooms/RoomTable';
import { useQuery } from '@tanstack/react-query';
import { Room, AttendeeLite, useRooms } from '@/features/rooms/api';
import { useState } from 'react';

export default function RoomsPage({ params }: { params: { id: string } }) {
  const [filters] = useState({
    status: [],
    category: '',
    search: '',
    sort: '',
    page: 1,
    pageSize: 100,
  });

  // Fetch rooms from API
  const { data: roomsData, isLoading: roomsLoading } = useRooms(params.id, filters);
  const rooms: Room[] = roomsData?.rooms || [];

  // Fetch all attendees for room assignment
  const { data: allAttendees = [], isLoading: attendeesLoading } = useQuery({
    queryKey: ['attendees', params.id, { all: true }],
    queryFn: async () => {
      const response = await fetch(`https://api.enout.app/api/events/${params.id}/attendees?page=1&pageSize=100`);
      if (!response.ok) throw new Error('Failed to fetch attendees');
      const data = await response.json();
      return data.data || [];
    },
  });

  // Transform attendees to AttendeeLite format for room assignment
  const eligibleAttendees: AttendeeLite[] = Array.isArray(allAttendees) ? allAttendees.map((attendee: any) => ({
    id: attendee.id,
    eventId: attendee.eventId,
    firstName: attendee.firstName || '',
    lastName: attendee.lastName || '',
    email: attendee.email,
    status: attendee.derivedStatus === 'accepted' ? 'accepted' : 'registered',
    assigned: null, // Will be populated by room assignment logic
  })) : [];

  return (
    <RoomTable
      rooms={rooms}
      eligibleAttendees={eligibleAttendees}
      eventId={params.id}
      isLoading={roomsLoading || attendeesLoading}
    />
  );
}