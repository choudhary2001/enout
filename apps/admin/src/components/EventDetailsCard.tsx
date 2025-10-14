'use client';

import { Calendar, MapPin, Clock, Users, FileText, Home } from 'lucide-react';
import { format } from 'date-fns';
import { EventType } from '@enout/shared';

interface EventDetailsCardProps {
  event: EventType;
}

export function EventDetailsCard({ event }: EventDetailsCardProps) {
  // Debug logging
  console.log('EventDetailsCard - received event:', event);
  console.log('EventDetailsCard - event properties:', {
    id: event?.id,
    name: event?.name,
    startDate: event?.startDate,
    endDate: event?.endDate,
    timezone: event?.timezone,
    status: event?.status,
    location: event?.location,
    _count: event?._count
  });
  
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '-';
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.log('EventDetailsCard - date formatting error:', error, 'for dateString:', dateString);
      return dateString || '-';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      if (!dateString) return '';
      return format(new Date(dateString), 'h:mm a');
    } catch (error) {
      console.log('EventDetailsCard - time formatting error:', error, 'for dateString:', dateString);
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Date Range</p>
                <p className="text-sm text-gray-600">
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">{event.location || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Timezone</p>
                <p className="text-sm text-gray-600">{event.timezone || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Statistics</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Attendees</p>
                <p className="text-sm text-gray-600">
                  {event._count?.attendees || 0} confirmed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Agenda Items</p>
                <p className="text-sm text-gray-600">
                  {event._count?.itineraryItems || 0} scheduled
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Invitations</p>
                <p className="text-sm text-gray-600">
                  {event._count?.invites || 0} sent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Event Status</p>
            <p className="text-sm text-gray-600 capitalize">
              {event.status?.replace('_', ' ') || 'Unknown'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {event.status?.replace('_', ' ') || 'Unknown'}
          </div>
        </div>
      </div>
    </div>
  );
}
