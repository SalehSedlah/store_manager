
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
 
export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localePrefix: 'as-needed',
    // By default, next-intl will look for i18n.ts in ./src or ./
  });

  const response = handleI18nRouting(request);

  // Add other security headers to the response returned by next-intl
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
