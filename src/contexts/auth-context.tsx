
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
  // Initialize router and pathname as null
  const [router, setRouter] = useState<ReturnType<typeof NextIntlNavigation.useRouter> | null>(null);
  const [pathname, setPathname] = useState<ReturnType<typeof NextIntlNavigation.usePathname> | null>(null);
  
  const locale = useLocale();

  // Effect to set router and pathname on client side
  useEffect(() => {
    // These hooks should only be called on the client side.
    setRouter(NextIntlNavigation.useRouter());
    setPathname(NextIntlNavigation.usePathname());
  }, []); // Empty dependency array ensures this runs once on mount (client-side)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Guard against running this effect if router or pathname are not yet initialized
    if (loading || !router || !pathname) return;

    const isAuthPage = pathname === `/login` || pathname === `/signup`;
    
    // Ensure router.push is only called with valid, initialized router
    if (!user && !isAuthPage) {
      router.push("/login");
    } else if (user && isAuthPage) {
      router.push("/dashboard");
    }
  }, [user, loading, router, pathname, locale]);

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
