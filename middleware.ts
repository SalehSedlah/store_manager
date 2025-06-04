
import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {locales, defaultLocale} from './src/i18n';

const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // or 'always' or 'never'
  // pathnames: { // Optional: for localized pathnames
  //   '/': '/',
  //   '/dashboard': {
  //     en: '/dashboard',
  //     ar: '/لوحة-التحكم'
  //   }
  // }
});

export default function middleware(request: NextRequest): NextResponse {
  // For testing, log when middleware is invoked
  console.log(`[MIDDLEWARE_DEBUG] Request to: ${request.nextUrl.pathname}`);

  const response = nextIntlMiddleware(request);

  // Apply security headers
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('x-dns-prefetch-control', 'off');
  response.headers.set('x-download-options', 'noopen');
  response.headers.set('x-frame-options', 'SAMEORIGIN');
  response.headers.set('x-xss-protection', '1; mode=block');
  
  console.log(`[MIDDLEWARE_DEBUG] Responding for: ${request.nextUrl.pathname}`);
  return response;
}

export const config = {
  // Match all paths except for internal Next.js paths, API routes, and static files
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ]
};
