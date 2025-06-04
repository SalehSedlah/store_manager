import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
 
export default async function middleware(request: NextRequest) {
  // Add a few basic security headers as an example
  // request.headers.set('x-content-type-options', 'nosniff');
  // request.headers.set('x-frame-options', 'DENY'); // More restrictive
  // request.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");


  const handleI18nRouting = createMiddleware({
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localePrefix: 'as-needed' 
  });

  const response = handleI18nRouting(request);

  // Add other security headers to the response returned by next-intl
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-dns-prefetch-control', 'off');
  response.headers.set('x-download-options', 'noopen');
  response.headers.set('x-frame-options', 'SAMEORIGIN'); // Or DENY if more appropriate
  response.headers.set('x-xss-protection', '1; mode=block');
  // Consider adding Content-Security-Policy, Strict-Transport-Security, etc.

  return response;
}
 
export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};