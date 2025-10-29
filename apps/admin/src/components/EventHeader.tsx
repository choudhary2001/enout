'use client';

import { useState } from 'react';
import { useEventStore } from '@/lib/store';
import { useEvents, useEvent } from '@/lib/hooks';
import { Button } from '@enout/ui';
import { ChevronDown, Calendar, MapPin, Users, Mail, FileText } from 'lucide-react';

function formatDate(dateString: string, timezone: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'upcoming':
      return 'bg-green-100 text-green-800';
    case 'ongoing':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function EventHeader() {
  const { selectedEventId, setSelectedEventId } = useEventStore();
  const { events, isLoading: eventsLoading, error: eventsError } = useEvents();
  const { event, error: eventError } = useEvent(selectedEventId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsDropdownOpen(false);
  };

  if (eventsError || eventError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="text-red-800">
            <strong>Error loading events:</strong> {eventsError?.message || eventError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Event Selector */}
        <div className="flex-1">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full justify-between text-left"
              disabled={eventsLoading}
            >
              {event ? (
                <span className="truncate">{event.name}</span>
              ) : eventsLoading ? (
                <span>Loading events...</span>
              ) : (
                <span>Select an event</span>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            
            {isDropdownOpen && events && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {events.map((eventOption) => (
                  <button
                    key={eventOption.id}
                    onClick={() => handleEventSelect(eventOption.id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="font-medium">{eventOption.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(eventOption.startDate, eventOption.timezone)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Event Meta & KPIs */}
        {event && (
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* Event Details */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {formatDate(event.startDate, event.timezone)} - {formatDate(event.endDate, event.timezone)}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{event.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Timezone:</span>
                <span className="text-sm font-medium">{event.timezone}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>

            {/* KPIs */}
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{event._count.attendees}</span>
                <span className="text-xs text-gray-500">attendees</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{event._count.invites}</span>
                <span className="text-xs text-gray-500">invites</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{event._count.itineraryItems}</span>
                <span className="text-xs text-gray-500">agenda</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
