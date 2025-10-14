import { CalendarBoard } from '@/components/CalendarBoard';

export default function SchedulePage({ params }: { params: { id: string } }) {
  return <CalendarBoard eventId={params.id} />;
}