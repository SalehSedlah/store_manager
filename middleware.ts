
import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  // THIS IS A CRITICAL LOG TO CHECK IF MIDDLEWARE IS RUNNING
  console.log(`[MIDDLEWARE_DEBUG] Middleware is running for request: ${request.nextUrl.pathname}`);

  // For now, just apply security headers without next-intl
  const response = NextResponse.next(); // Create a basic response

  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-dns-prefetch-control', 'off');
  response.headers.set('x-download-options', 'noopen');
  response.headers.set('x-frame-options', 'SAMEORIGIN');
  response.headers.set('x-xss-protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
};
