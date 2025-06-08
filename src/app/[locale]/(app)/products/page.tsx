
"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

// Minimal fallback page for [locale]/products.
// This should ideally not be rendered.

export default function LocaleFallbackMinimalProductsPage({ params }: { params: { locale: string }}) {
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
}
