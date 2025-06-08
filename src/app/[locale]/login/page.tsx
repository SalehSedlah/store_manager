
"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

// Minimal fallback page for [locale]/login.
// This should ideally not be rendered.

export default function LocaleFallbackMinimalLoginPage({ params }: { params: { locale: string }}) {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/login/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /login. This path should ideally not be active.`
  );

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية لتسجيل الدخول</h1>
      <p>تتم الآن محاولة إعادة توجيهك إلى صفحة تسجيل الدخول الرئيسية...</p>
      <p>المسار المطلوب كان: /{params.locale}/login</p>
    </div>
  );
}
