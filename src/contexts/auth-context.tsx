
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import * as NextIntlNavigation from "next-intl/navigation";
import { useLocale } from "next-intl";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for router and pathname, to be set on client-side
  const [router, setRouter] = useState<ReturnType<typeof NextIntlNavigation.useRouter> | null>(null);
  const [pathname, setPathname] = useState<ReturnType<typeof NextIntlNavigation.usePathname> | null>(null);
  
  const locale = useLocale(); // This hook is from 'next-intl', generally safe at top level of client component.

  // Effect to initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Effect to initialize router and pathname strictly on the client-side after mount
  useEffect(() => {
    // These hooks are specific to next-intl/navigation and require NextIntlClientProvider
    setRouter(NextIntlNavigation.useRouter());
    setPathname(NextIntlNavigation.usePathname());
  }, []); // Empty dependency array ensures this runs once on mount (client-side)

  // Effect for redirection logic, depends on auth state and navigation tools
  useEffect(() => {
    // Guard against running if loading, or if router/pathname haven't been initialized yet (client-side)
    if (loading || !router || !pathname) {
      return;
    }

    // Pathname from next-intl/navigation does not include the locale prefix
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    
    if (!user && !isAuthPage) {
      router.push("/login");
    } else if (user && isAuthPage) {
      router.push("/dashboard");
    }
  }, [user, loading, router, pathname, locale]); // locale added as a dependency as router.push is locale-aware

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
