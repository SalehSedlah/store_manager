
"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

interface FallbackPageProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LocaleFallbackMinimalSignupPage: React.FC<FallbackPageProps> = ({ params, searchParams }) => {
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
};

export default LocaleFallbackMinimalSignupPage;
