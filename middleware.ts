
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

export function middleware(request: NextRequest) {
  // THIS IS A CRITICAL LOG TO CHECK IF MIDDLEWARE IS RUNNING
  console.log(`[MIDDLEWARE_DEBUG] Middleware is running for request: ${request.nextUrl.pathname}`);

  const nextIntlMiddleware = createMiddleware({
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localePrefix: 'as-needed',
    // No explicit path needed here for i18n config if it's in /src/i18n.ts
    // next-intl should auto-detect it.
  });

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
