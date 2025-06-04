
import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-dns-prefetch-control', 'off');
  response.headers.set('x-download-options', 'noopen');
  response.headers.set('x-frame-options', 'SAMEORIGIN');
  response.headers.set('x-xss-protection', '1; mode=block');
  
  return response;
}

export const config = {
  // Match all paths except for internal Next.js paths, API routes, and static files
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ]
};
