import { GuestListPage } from '@/features/guests/GuestListPage';

export default function GuestsPage({ params }: { params: { id: string } }) {
  return <GuestListPage eventId={params.id} />;
}