import { redirect } from 'next/navigation';

export default function EventPage({ params }: { params: { id: string } }) {
  // Redirect to schedule tab by default
  redirect(`/events/${params.id}/schedule`);
}
