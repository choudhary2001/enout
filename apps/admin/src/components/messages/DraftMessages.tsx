'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { Edit, Trash2, Mail, Users, Clock } from 'lucide-react';
import { useState } from 'react';

interface DraftMessagesProps {
  eventId: string;
  onDraftClick: (draft: any) => void;
}

export function DraftMessages({ eventId, onDraftClick }: DraftMessagesProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages', eventId, 'drafts'],
    queryFn: () => api.getMessages(eventId),
    select: (data) => data.filter((msg: any) => msg.status === 'draft'),
  });

  const handleDelete = async (messageId: string) => {
    setDeletingId(messageId);
    try {
      await api.deleteMessage(eventId, messageId);
      // Refresh the list
    } catch (error) {
      console.error('Failed to delete draft:', error);
    } finally {
      setDeletingId(null);
    }
  };

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
        <div className="text-lg font-medium text-red-600 mb-2">Error loading drafts</div>
        <p className="text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Edit className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts</h3>
        <p className="text-gray-500">Draft messages will appear here.</p>
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
            <div className="flex items-center text-orange-600 ml-4">
              <Edit className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Draft</span>
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
                <span>Created {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onDraftClick(message)}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(message.id)}
                disabled={deletingId === message.id}
                className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deletingId === message.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
