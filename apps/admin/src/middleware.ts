import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect root to /events
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  return NextResponse.next();
}
