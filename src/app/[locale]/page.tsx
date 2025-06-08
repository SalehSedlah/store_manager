
"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation'; // Standard Next.js import

export default function LocaleFallbackRootPage({ params }: { params: { locale: string }}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const loadingText = "جاري التحميل (Fallback)..."; // Arabic text

  console.warn(
    `[Warning] Fallback page /src/app/[locale]/page.tsx rendered for locale: '${params.locale}'. ` +
    `This file path should ideally not be active after i18n removal. ` +
    `Please ensure Next.js is routing to /app/page.tsx.`
  );

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up animate-pulse"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <Skeleton className="h-6 w-[250px] bg-primary/20" />
        <Skeleton className="h-4 w-[200px] bg-primary/10" />
        <p className="text-sm text-muted-foreground">{loadingText}</p>
      </div>
    </div>
  );
}
