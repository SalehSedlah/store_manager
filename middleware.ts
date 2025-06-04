
import createNextIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/i18n'; // Correct path if i18n.ts is in src

const nextIntlMiddleware = createNextIntlMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'as-needed', // Options: 'always', 'as-needed', 'never'
});

export function middleware(request: NextRequest): NextResponse {
  // THIS IS A CRITICAL LOG TO CHECK IF MIDDLEWARE IS RUNNING
  console.log(`[MIDDLEWARE_DEBUG] Middleware is running for request: ${request.nextUrl.pathname}`);

  // Apply next-intl middleware
  const intlResponse = nextIntlMiddleware(request);

  // Apply security headers to the response from next-intl
  intlResponse.headers.set('x-content-type-options', 'nosniff');
  intlResponse.headers.set('x-dns-prefetch-control', 'off');
  intlResponse.headers.set('x-download-options', 'noopen');
  intlResponse.headers.set('x-frame-options', 'SAMEORIGIN');
  intlResponse.headers.set('x-xss-protection', '1; mode=block');

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all paths except for internal Next.js paths, API routes, and static files
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ]
};
