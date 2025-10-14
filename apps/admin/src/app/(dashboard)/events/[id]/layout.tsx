'use client';

import { useEffect } from 'react';
import { TopTabs } from '@/components/TopTabs';
import { EventHeaderBar } from '@/components/EventHeaderBar';
import { useEventStore } from '@/lib/store';
import { useEvent } from '@/lib/hooks';

export default function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { setSelectedEventId, setSelectedEvent } = useEventStore();
  const { event, isLoading } = useEvent(params.id);

  // Update the store when the event is loaded
  useEffect(() => {
    if (event) {
      setSelectedEventId(params.id);
      setSelectedEvent(event);
    }
  }, [event, params.id, setSelectedEventId, setSelectedEvent]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-red-500">Event not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Use existing EventHeaderBar component */}
      <EventHeaderBar eventId={params.id} />
      
      {/* Use existing TopTabs component */}
      <TopTabs eventId={params.id} />
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}