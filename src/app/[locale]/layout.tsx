
import React from 'react';
import '../globals.css'; // Path to globals.css from app/[locale]/

// Minimal passthrough layout for fallback [locale] routes.
// This should ideally not be rendered if i18n removal and routing are correct.

export default function LocaleFallbackMinimalLayout({
  children,
  params // Use 'any'
}: {
  children: React.ReactNode;
  params: any; // Explicitly 'any'
}) {
  const locale = params && typeof params.locale === 'string' ? params.locale : 'unknown_locale_in_root_layout';
  console.warn(
    `[Warning] MINIMAL Fallback layout /src/app/[locale]/layout.tsx rendered for locale: '${locale}'. ` +
    `This path should ideally not be active. Ensure Next.js is routing to /app/layout.tsx.`
  );

  // Using basic html structure without specific lang/dir from locale,
  // as the main /app/layout.tsx should handle this.
  return (
    <html lang="ar" dir="rtl">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}
