
import React from 'react';
import '../globals.css'; // Path to globals.css from app/[locale]/

// Minimal passthrough layout for fallback [locale] routes.
// This should ideally not be rendered if i18n removal and routing are correct.

export default function LocaleFallbackMinimalLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  console.warn(
    `[Warning] MINIMAL Fallback layout /src/app/[locale]/layout.tsx rendered for locale: '${params.locale}'. ` +
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
