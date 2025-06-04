
import { type NextRequest, NextResponse } from 'next/server';

// This middleware will only apply security headers for now.
// Internationalization is removed.

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-dns-prefetch-control', 'off');
  response.headers.set('x-download-options', 'noopen');
  response.headers.set('x-frame-options', 'SAMEORIGIN');
  response.headers.set('x-xss-protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    // Match all paths except for internal Next.js paths, API routes, and static files
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ]
};
