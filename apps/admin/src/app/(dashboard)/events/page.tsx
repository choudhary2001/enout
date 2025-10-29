import { Calendar, Users, MessageSquare, Home } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Select an Event
        </h1>
        
        <p className="text-gray-600 mb-8">
          Choose an event from the sidebar to start managing your event details, 
          guests, messages, and room assignments.
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="h-4 w-4" />
            <span>Guests</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Home className="h-4 w-4" />
            <span>Rooms</span>
          </div>
        </div>
      </div>
    </div>
  );
}