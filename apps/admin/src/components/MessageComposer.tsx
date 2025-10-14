'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Clock, Users, Paperclip, Calendar, Edit } from 'lucide-react';
import { api } from '@/lib/api';
// import { MessageType } from '@enout/shared';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const messageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Message body is required'),
  audience: z.enum(['all', 'invited', 'accepted']),
  scheduledFor: z.string().optional(),
});

type MessageForm = z.infer<typeof messageSchema>;

interface MessageComposerProps {
  eventId: string;
  editingDraft?: any;
  onDraftSaved?: () => void;
}

export function MessageComposer({ eventId, editingDraft, onDraftSaved }: MessageComposerProps) {
  const queryClient = useQueryClient();
  const [isScheduling, setIsScheduling] = useState(false);

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', eventId],
    queryFn: () => api.getMessages(eventId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      audience: 'all',
      title: editingDraft?.title || '',
      body: editingDraft?.body || '',
      scheduledFor: editingDraft?.scheduledFor || '',
    },
  });

  // Update form when editingDraft changes
  React.useEffect(() => {
    if (editingDraft) {
      setValue('title', editingDraft.title || '');
      setValue('body', editingDraft.body || '');
      setValue('audience', editingDraft.audience || 'all');
      setValue('scheduledFor', editingDraft.scheduledFor || '');
    } else {
      reset({
        title: '',
        body: '',
        audience: 'all',
        scheduledFor: '',
      });
    }
  }, [editingDraft, setValue, reset]);

  const createMessageMutation = useMutation({
    mutationFn: (data: MessageForm) => {
      if (editingDraft) {
        return api.updateMessage(eventId, editingDraft.id, { ...data, status: 'sent' });
      }
      return api.createMessage(eventId, { ...data, status: 'sent' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', eventId] });
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully.',
      });
      reset();
      setIsScheduling(false);
      onDraftSaved?.();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: (data: MessageForm) => {
      if (editingDraft) {
        return api.updateMessage(eventId, editingDraft.id, { ...data, status: 'draft' });
      }
      return api.createMessage(eventId, { ...data, status: 'draft' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', eventId] });
      onDraftSaved?.();
      toast({
        title: 'Draft saved',
        description: 'Your message has been saved as a draft.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: MessageForm) => {
    createMessageMutation.mutate(data);
  };

  const onSaveDraft = (data: MessageForm) => {
    saveDraftMutation.mutate(data);
  };

  const _audience = watch('audience');

  return (
    <div className="p-6">
      {/* Composer */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Message</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="message-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="message-title"
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter message title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message-body" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message-body"
              {...register('body')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Write your message here..."
            />
            {errors.body && (
              <p className="text-sm text-red-600 mt-1">{errors.body.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
                Audience
              </label>
              <select
                id="audience"
                {...register('audience')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Attendees</option>
                <option value="invited">Invited Only</option>
                <option value="accepted">Accepted Only</option>
              </select>
            </div>

            <div>
              <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
                Attachments
              </label>
              <button
                id="attachments"
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Paperclip className="h-4 w-4" />
                Add Files
              </button>
            </div>
          </div>

          {isScheduling && (
            <div>
              <label htmlFor="schedule-for" className="block text-sm font-medium text-gray-700 mb-1">
                Schedule For
              </label>
              <input
                id="schedule-for"
                {...register('scheduledFor')}
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={createMessageMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {createMessageMutation.isPending ? 'Sending...' : 'Send Now'}
            </button>
            
            <button
              type="button"
              onClick={handleSubmit(onSaveDraft)}
              disabled={saveDraftMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Edit className="h-4 w-4" />
              {saveDraftMutation.isPending ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button
              type="button"
              onClick={() => setIsScheduling(!isScheduling)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Clock className="h-4 w-4" />
              {isScheduling ? 'Cancel Schedule' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>

      {/* Message History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Message History</h3>
        
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>No messages sent yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: any) => (
              <div key={message.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{message.title}</h4>
                  <div className="flex items-center gap-2">
                    {message.status === 'scheduled' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        <Clock className="h-3 w-3" />
                        Scheduled
                      </span>
                    )}
                    {message.status === 'sent' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <Send className="h-3 w-3" />
                        Sent
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{message.body}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {message.audience}
                  </span>
                  {message.scheduledFor && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(message.scheduledFor), 'MMM d, yyyy h:mm a')}
                    </span>
                  )}
                  {message.sentAt && (
                    <span>
                      Sent {format(new Date(message.sentAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
