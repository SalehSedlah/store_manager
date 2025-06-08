"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

interface FallbackPageProps {
  params: { locale: string };
}

const LocaleFallbackMinimalProductsPage: React.FC<FallbackPageProps> = ({ params }) => {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/(app)/products/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /products. This path should ideally not be active.`
  );

  useEffect(() => {
    router.replace("/products");
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية للمنتجات</h1>
      <p>تتم الآن محاولة إعادة توجيهك إلى صفحة المنتجات الرئيسية...</p>
      <p>المسار المطلوب كان: /{params.locale}/products</p>
    </div>
  );
};

export default LocaleFallbackMinimalProductsPage;
