
"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

interface FallbackPageProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const LocaleFallbackMinimalRootPage: React.FC<FallbackPageProps> = ({ params, searchParams }) => {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /login. This path should ideally not be active.`
  );

  useEffect(() => {
    router.replace("/login"); // Or perhaps just / to let the root page decide
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية</h1>
      <p>إذا رأيت هذه الصفحة، فهذا يعني أن هناك مشكلة في التوجيه بعد إزالة الترجمة.</p>
      <p>تتم الآن محاولة إعادة توجيهك...</p>
      <p>المسار المطلوب كان: /{params.locale}</p>
    </div>
  );
};

export default LocaleFallbackMinimalRootPage;
