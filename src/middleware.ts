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
    localePrefix: 'as-needed',
    // Make sure this path is correct
    // If i18n.ts is in src/internationalization/i18n.ts, then:
    // Next-intl expects i18n.ts to be in the src directory by default
    // If you've moved it, you need to tell next-intl where to find it.
    // However, the error "Couldn't find next-intl config file" usually means
    // it's looking in the default location and not finding it.
    // Let's assume for now i18n.ts will be moved to src/i18n.ts
    // pathnames: {
    //   '/': '/',
    //   '/login': '/login'
    // }
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
