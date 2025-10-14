'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { Mail, Users, Clock, CheckCircle } from 'lucide-react';

interface SentMessagesProps {
  eventId: string;
}

export function SentMessages({ eventId }: SentMessagesProps) {
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages', eventId, 'sent'],
    queryFn: () => api.getMessages(eventId),
    select: (data) => data.filter((msg: any) => msg.status === 'sent'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-lg font-medium text-red-600 mb-2">Error loading messages</div>
        <p className="text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sent messages</h3>
        <p className="text-gray-500">Messages you send will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message: any) => (
        <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{message.title}</h3>
              <p className="text-gray-600 line-clamp-3">{message.body}</p>
            </div>
            <div className="flex items-center text-green-600 ml-4">
              <CheckCircle className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Sent</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>All attendees</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Sent {format(new Date(message.sentAt || message.createdAt), 'MMM d, yyyy h:mm a')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">•</span>
              <span>{message.recipientCount || 0} recipients</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
