
"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

interface FallbackPageProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LocaleFallbackMinimalDebtManagementPage: React.FC<FallbackPageProps> = ({ params, searchParams }) => {
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
};

export default LocaleFallbackMinimalDebtManagementPage;
