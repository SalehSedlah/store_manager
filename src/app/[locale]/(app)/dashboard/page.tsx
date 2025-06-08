
"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

// Minimal fallback page for [locale]/dashboard.
// This should ideally not be rendered.

export default function LocaleFallbackMinimalDashboardPage({ params }: { params: { locale: string }}) {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/(app)/dashboard/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /dashboard. This path should ideally not be active.`
  );

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية للوحة التحكم</h1>
      <p>تتم الآن محاولة إعادة توجيهك إلى لوحة التحكم الرئيسية...</p>
      <p>المسار المطلوب كان: /{params.locale}/dashboard</p>
    </div>
  );
}
