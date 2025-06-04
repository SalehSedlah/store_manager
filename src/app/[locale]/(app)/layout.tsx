
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next-intl/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NextIntlClientProvider, useMessages, useTranslations } from "next-intl";
// useParams to get locale for router.push if needed, though next-intl router should handle it
// import { useParams } from 'next/navigation'; 

// AuthGuard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter(); // from next-intl
  const pathname = usePathname(); // from next-intl
  
  // useTranslations is now safe to call as AuthGuard is a child of NextIntlClientProvider
  const t = useTranslations("AuthGuard"); 
  const loadingSessionText = t("loadingSession");

  useEffect(() => {
    if (!loading && !user) {
      // useRouter from next-intl should handle locale automatically when navigating
      router.replace(`/login`); 
    }
    // Example: Redirect if user is logged in and lands on login/signup.
    // This check is usually better within the login/signup pages themselves.
    // const isAuthPage = pathname === "/login" || pathname === "/signup";
    // if (!loading && user && isAuthPage) {
    //   router.replace('/dashboard');
    // }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <p className="text-sm text-muted-foreground">{loadingSessionText}</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export default function AppLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = useMessages(); // Get messages for the provider
  const { locale } = params; // Get current locale from params

  return (
    <NextIntlClientProvider locale={locale} messages={messages}> {/* Provider is here */}
      <AuthGuard> {/* AuthGuard is now a direct child of NextIntlClientProvider */}
        <SidebarProvider defaultOpen>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-col">
              <AppHeader />
              <main className="flex-1 overflow-y-auto p-6 bg-background">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </AuthGuard>
    </NextIntlClientProvider>
  );
}
