'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttendeeLite } from '@/features/rooms/api';

interface GuestCellPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (attendee: AttendeeLite | null) => void;
  currentAttendee: AttendeeLite | null;
  eligibleAttendees: AttendeeLite[];
  eventId: string;
}

export function GuestCellPicker({
  isOpen,
  onClose,
  onSelect,
  currentAttendee,
  eligibleAttendees,
  eventId,
}: GuestCellPickerProps) {
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredAttendees = (Array.isArray(eligibleAttendees) ? eligibleAttendees : []).filter(attendee =>
    attendee.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    attendee.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    attendee.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredAttendees.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredAttendees.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredAttendees[highlightedIndex]) {
          onSelect(filteredAttendees[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleSelect = (attendee: AttendeeLite) => {
    onSelect(attendee);
  };

  const handleClear = () => {
    onSelect(null);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search attendees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div ref={listRef} className="max-h-60 overflow-y-auto">
        {currentAttendee && (
          <div className="p-2 border-b border-gray-100">
            <button
              onClick={handleClear}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
              Clear assignment
            </button>
          </div>
        )}

        {filteredAttendees.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No attendees found
          </div>
        ) : (
          filteredAttendees.map((attendee, index) => (
            <button
              key={attendee.id}
              onClick={() => handleSelect(attendee)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors',
                index === highlightedIndex && 'bg-primary/10',
                currentAttendee?.id === attendee.id && 'bg-green-50'
              )}
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {attendee.firstName} {attendee.lastName}
                  </span>
                  {currentAttendee?.id === attendee.id && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {attendee.email}
                </div>
                {attendee.assigned && (
                  <div className="text-xs text-amber-600">
                    Assigned to Room {attendee.assigned.roomNo}
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="p-2 border-t border-gray-200 text-xs text-gray-500">
        Use ↑↓ to navigate, Enter to select, Esc to close
      </div>
    </div>
  );
}



