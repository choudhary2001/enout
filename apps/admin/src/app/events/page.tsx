import { Suspense } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { eventSummaryArraySchema } from '@enout/shared';
import { api } from '../../lib/api';

/**
 * Events page component
 */
export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Events</h1>
      
      <Suspense fallback={<EventsTableSkeleton />}>
        <EventsTable />
      </Suspense>
    </div>
  );
}

/**
 * Events table component
 */
async function EventsTable() {
  try {
    const events = await api.get('/events', eventSummaryArraySchema);
    
    if (events.length === 0) {
      return <EmptyState />;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Dates</th>
              <th className="p-4 font-semibold">Timezone</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Attendees</th>
              <th className="p-4 font-semibold">Invites</th>
              <th className="p-4 font-semibold">Agenda Items</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <Link href={`/events/${event.id}`} className="text-blue-600 hover:underline">
                    {event.name}
                  </Link>
                </td>
                <td className="p-4">
                  {formatDateRange(event.startDate, event.endDate)}
                </td>
                <td className="p-4">{event.timezone}</td>
                <td className="p-4">
                  <EventStatusBadge status={event.status} />
                </td>
                <td className="p-4">{event._count.attendees}</td>
                <td className="p-4">{event._count.invites}</td>
                <td className="p-4">{event._count.itineraryItems}</td>
                <td className="p-4">
                  <Link 
                    href={`/events/${event.id}/guests`}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View guests
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return <ErrorState error={error instanceof Error ? error.message : 'Failed to fetch events'} />;
  }
}

/**
 * Format date range
 */
function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If same day, show only one date
  if (start.toDateString() === end.toDateString()) {
    return `${format(start, 'MMM d, yyyy')} (${format(start, 'h:mm a')} - ${format(end, 'h:mm a')})`;
  }
  
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

/**
 * Event status badge component
 */
function EventStatusBadge({ status }: { status: string }) {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';
  
  switch (status.toLowerCase()) {
    case 'upcoming':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'active':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'completed':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    case 'cancelled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
  }
  
  return (
    <span className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded-full`}>
      {status}
    </span>
  );
}

/**
 * Events table skeleton component
 */
function EventsTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
      <p className="text-gray-500">There are no events to display.</p>
    </div>
  );
}

/**
 * Error state component
 */
function ErrorState({ error }: { error: string }) {
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium text-red-800 mb-2">Error loading events</h3>
      <p className="text-gray-700">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}