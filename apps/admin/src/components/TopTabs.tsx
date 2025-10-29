'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { name: 'Schedule', href: 'schedule' },
  { name: 'Guest List', href: 'guests' },
  { name: 'Broadcast Messages', href: 'messages' },
  { name: 'Rooming Plan', href: 'rooms' },
];

interface TopTabsProps {
  eventId: string;
}

export function TopTabs({ eventId }: TopTabsProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-8 py-4">
        <nav className="flex gap-2">
          {tabs.map((tab) => {
            const isActive = pathname.includes(`/${tab.href}`);
            return (
              <Link
                key={tab.name}
                href={`/events/${eventId}/${tab.href}`}
                className={cn(
                  'px-6 py-2.5 text-sm font-medium rounded-full transition-all',
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
