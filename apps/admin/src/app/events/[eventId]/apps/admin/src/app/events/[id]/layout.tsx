'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const pathname = usePathname();
  
  const tabs = [
    { name: 'Schedule', href: `/events/${params.id}/schedule` },
    { name: 'Guests', href: `/events/${params.id}/guests` },
    { name: 'Messages', href: `/events/${params.id}/messages` },
    { name: 'Rooms', href: `/events/${params.id}/rooms` },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Event: {params.id}</h1>
        <Link href="/events" className="text-blue-500 hover:underline">
          ← Back to all events
        </Link>
      </div>

      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`py-3 px-1 border-b-2 ${
                  isActive
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}
