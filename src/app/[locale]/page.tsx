
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed to next/navigation
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

// This page component will handle redirection from /[locale] to /dashboard or /login
// It assumes 'en' or any value in [locale] will behave the same way since i18n is removed.
export default function HomePage({ params }: { params: { locale: string } }) { 
  const { user, loading } = useAuth();
  const router = useRouter();
  // const locale = params.locale || 'en'; // 'locale' from params is now less relevant

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(`/dashboard`); // No locale prefix
      } else {
        router.replace(`/login`); // No locale prefix
      }
    }
  }, [user, loading, router]);


  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up animate-pulse"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          <Skeleton className="h-6 w-[200px] bg-primary/20" />
          <Skeleton className="h-4 w-[150px] bg-primary/10" />
        </div>
      </div>
  );
}
