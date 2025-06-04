
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const nextIntlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' 
});

export function middleware(request: NextRequest) {
  // Apply next-intl middleware
  const response = nextIntlMiddleware(request);

  // Add other security headers to the response from next-intl
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-dns-prefetch-control', 'off');
  response.headers.set('x-download-options', 'noopen');
  response.headers.set('x-frame-options', 'SAMEORIGIN');
  response.headers.set('x-xss-protection', '1; mode=block');

  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/` and static assets
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
};
