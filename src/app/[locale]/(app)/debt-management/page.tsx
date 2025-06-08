
"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

// Minimal fallback page for [locale]/debt-management.
// This should ideally not be rendered.

export default function LocaleFallbackMinimalDebtManagementPage({ params }: { params: { locale: string }}) {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/(app)/debt-management/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /debt-management. This path should ideally not be active.`
  );

  useEffect(() => {
    router.replace("/debt-management");
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية لإدارة الديون</h1>
      <p>تتم الآن محاولة إعادة توجيهك إلى إدارة الديون الرئيسية...</p>
      <p>المسار المطلوب كان: /{params.locale}/debt-management</p>
    </div>
  );
}

