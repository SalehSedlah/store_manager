
"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

interface FallbackPageProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LocaleFallbackMinimalDashboardPage: React.FC<FallbackPageProps> = ({ params, searchParams }) => {
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
};

export default LocaleFallbackMinimalDashboardPage;
