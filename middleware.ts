
import type { NextRequest, NextResponse } from 'next/server';
 
export function middleware(request: NextRequest): NextResponse {
  // Simple pass-through, but we'll add security headers here
  // This function is called for every request matched by the matcher.
  // You can customize the response object if needed.
  const response = Response.next();

  // Add other security headers to the response
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-dns-prefetch-control', 'off');
  response.headers.set('x-download-options', 'noopen');
  response.headers.set('x-frame-options', 'SAMEORIGIN'); 
  response.headers.set('x-xss-protection', '1; mode=block');

  return response;
}
 
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
