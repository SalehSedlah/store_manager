
"use client";

// Minimal fallback for [locale]/(app) layout.
// This should ideally not be rendered.
import React from 'react';

export default function AppLocaleFallbackMinimalLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  console.warn(
    `[Warning] MINIMAL Fallback app layout /src/app/[locale]/(app)/layout.tsx rendered for locale: '${params.locale}'. ` +
    `This path should ideally not be active. Ensure Next.js is routing to /app/(app)/layout.tsx.`
  );

  return (
    <div style={{ border: '2px dashed red', padding: '20px', minHeight: '100vh', direction: 'rtl' }}>
      <h1>تخطيط احتياطي للتطبيق ({params.locale})</h1>
      <p>إذا رأيت هذا، فهذا يعني أن التوجيه إلى تخطيط التطبيق الرئيسي قد فشل.</p>
      {children}
    </div>
  );
}
