
"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

// Minimal fallback page for [locale]/settings.
// This should ideally not be rendered.

export default function LocaleFallbackMinimalSettingsPage({ params }: { params: { locale: string }}) {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/(app)/settings/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /settings. This path should ideally not be active.`
  );

  useEffect(() => {
    router.replace("/settings");
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية للإعدادات</h1>
      <p>تتم الآن محاولة إعادة توجيهك إلى صفحة الإعدادات الرئيسية...</p>
      <p>المسار المطلوب كان: /{params.locale}/settings</p>
    </div>
  );
}
