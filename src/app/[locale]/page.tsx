
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next-intl/navigation"; // Use next-intl for navigation
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function LocaleSpecificRootPage({ params }: { params: { locale: string }}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("AuthGuard"); // Example, assuming you have this key

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If on the locale root page (e.g., /en or /ar) and logged in, redirect to dashboard for that locale
        if (pathname === `/${params.locale}` || pathname === `/${params.locale}/`) {
          router.replace(`/${params.locale}/dashboard`);
        }
        // If already on a deeper path (e.g. /en/dashboard), AuthGuard in AppLayout will handle it.
      } else {
        // If on the locale root page and not logged in, redirect to login for that locale
         if (pathname === `/${params.locale}` || pathname === `/${params.locale}/`) {
            router.replace(`/${params.locale}/login`);
         }
        // If trying to access protected routes, AuthGuard in AppLayout will redirect to login.
      }
    }
  }, [user, loading, router, params.locale, pathname]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up animate-pulse"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <Skeleton className="h-6 w-[200px] bg-primary/20" />
        <Skeleton className="h-4 w-[150px] bg-primary/10" />
        <p className="text-sm text-muted-foreground">{t('loadingSession')}</p>
      </div>
    </div>
  );
}
