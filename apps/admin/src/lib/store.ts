import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type EventType } from '@enout/shared';

interface EventStore {
  selectedEventId: string | null;
  selectedEvent: EventType | null;
  setSelectedEventId: (eventId: string | null) => void;
  setSelectedEvent: (event: EventType | null) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      selectedEventId: null,
      selectedEvent: null,
      setSelectedEventId: (eventId) => set((state) => {
        if (state.selectedEventId === eventId) return state;
        return { selectedEventId: eventId };
      }),
      setSelectedEvent: (event) => set((state) => {
        if (state.selectedEvent?.id === event?.id) return state;
        return { selectedEvent: event };
      }),
    }),
    {
      name: 'enout-event-store',
      partialize: (state) => ({ selectedEventId: state.selectedEventId }),
    }
  )
);
