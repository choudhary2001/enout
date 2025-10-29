'use client';

import { useEventStore } from '@/lib/store';
import { Clock, Calendar } from 'lucide-react';

export function EventTimelineCard() {
  const { selectedEvent } = useEventStore();

  if (!selectedEvent) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Event Timeline</h3>
        </div>
        <p className="text-gray-500">Select an event to view the timeline</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Event Timeline</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <div className="font-medium">Event Start</div>
            <div className="text-sm text-gray-600">
              {new Date(selectedEvent.startDate).toLocaleDateString('en-US', {
                timeZone: selectedEvent.timezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <div className="font-medium">Event End</div>
            <div className="text-sm text-gray-600">
              {new Date(selectedEvent.endDate).toLocaleDateString('en-US', {
                timeZone: selectedEvent.timezone,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg font-medium mb-2">Timeline coming soon</div>
          <div className="text-sm">
            Detailed event timeline and schedule will be available here
          </div>
        </div>
      </div>
    </div>
  );
}
