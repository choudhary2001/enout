'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageComposer } from '@/components/MessageComposer';
import { SentMessages } from '@/components/messages/SentMessages';
import { DraftMessages } from '@/components/messages/DraftMessages';
import { api } from '@/lib/api';

type MessageTab = 'sent' | 'drafts' | 'compose';

export default function MessagesPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<MessageTab>('sent');
  const [editingDraft, setEditingDraft] = useState<any>(null);

  // Fetch all messages to calculate counts
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', params.id],
    queryFn: () => api.getMessages(params.id),
  });

  // Calculate counts
  const sentCount = messages.filter((msg: any) => msg.status === 'sent').length;
  const draftsCount = messages.filter((msg: any) => msg.status === 'draft').length;

  const handleDraftClick = (draft: any) => {
    setEditingDraft(draft);
    setActiveTab('compose');
  };

  const handleDraftSaved = () => {
    setEditingDraft(null);
  };

  const tabs = [
    { id: 'sent' as MessageTab, label: 'Sent', count: sentCount },
    { id: 'drafts' as MessageTab, label: 'Drafts', count: draftsCount },
    { id: 'compose' as MessageTab, label: 'Send Message', count: null },
  ];

  return (
    <div className="p-6 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Manage event communications</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== 'compose') {
                  setEditingDraft(null);
                }
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="pb-6">
        {activeTab === 'sent' && (
          <SentMessages eventId={params.id} />
        )}
        
        {activeTab === 'drafts' && (
          <DraftMessages 
            eventId={params.id} 
            onDraftClick={handleDraftClick}
          />
        )}
        
        {activeTab === 'compose' && (
          <MessageComposer 
            eventId={params.id}
            editingDraft={editingDraft}
            onDraftSaved={handleDraftSaved}
          />
        )}
      </div>
    </div>
  );
}
