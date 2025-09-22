import { Nav } from '@/components/nav';

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
