
"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

// Minimal fallback page for [locale] root.
// This should ideally not be rendered.

export default function LocaleFallbackMinimalRootPage({ params }: { params: { locale: string }}) {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /login. This path should ideally not be active.`
  );

  useEffect(() => {
    // Attempt to redirect to a known working page if this fallback is hit.
    router.replace("/login");
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية</h1>
      <p>إذا رأيت هذه الصفحة، فهذا يعني أن هناك مشكلة في التوجيه بعد إزالة الترجمة.</p>
      <p>تتم الآن محاولة إعادة توجيهك...</p>
      <p>المسار المطلوب كان: /{params.locale}</p>
    </div>
  );
}

