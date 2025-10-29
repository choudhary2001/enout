'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@enout/ui';

export function Nav() {
  const pathname = usePathname();
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 px-8 h-16 border-b">
      <Link href="/" className="text-xl font-bold text-primary">
        Enout Admin
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        <Link href="/events">
          <Button 
            variant={pathname.startsWith('/events') ? 'default' : 'ghost'}
          >
            Events
          </Button>
        </Link>
      </div>
    </nav>
  );
}
