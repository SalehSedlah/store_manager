"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';

interface FallbackPageProps {
  params: { locale: string };
}

const LocaleFallbackMinimalAiAssistantPage: React.FC<FallbackPageProps> = ({ params }) => {
  const router = useRouter();

  console.warn(
    `[Warning] MINIMAL Fallback page /src/app/[locale]/(app)/ai-assistant/page.tsx rendered for locale: '${params.locale}'. ` +
    `Redirecting to /ai-assistant. This path should ideally not be active.`
  );

  useEffect(() => {
    router.replace("/ai-assistant");
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h1>صفحة احتياطية للمساعد الذكي</h1>
      <p>تتم الآن محاولة إعادة توجيهك إلى المساعد الذكي الرئيسي...</p>
      <p>المسار المطلوب كان: /{params.locale}/ai-assistant</p>
    </div>
  );
};

export default LocaleFallbackMinimalAiAssistantPage;
