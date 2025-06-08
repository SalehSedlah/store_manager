
"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

// Minimal fallback page for [locale]/signup.
// This should ideally not be rendered.

export default function LocaleFallbackMinimalSignupPage({ params }: { params: { locale: string }}) {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/signup/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /signup. This path should ideally not be active.`
  );

  useEffect(() => {
    router.replace("/signup");
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية لإنشاء حساب</h1>
      <p>تتم الآن محاولة إعادة توجيهك إلى صفحة إنشاء الحساب الرئيسية...</p>
      <p>المسار المطلوب كان: /{params.locale}/signup</p>
    </div>
  );
}
