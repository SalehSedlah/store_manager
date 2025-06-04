
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next-intl/navigation"; // Changed import
import { useLocale } from "next-intl";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    // For next-intl, public paths are generally those not prefixed by a locale
    // or specific locale-prefixed auth pages.
    // The middleware handles redirecting to a locale for `/`
    // So, `pathname` here will already be locale-prefixed if not an asset.
    const isAuthPage = pathname === `/login` || pathname === `/signup`;
    // If the path is just `/${locale}`, it's effectively a public landing before redirect
    const isLocaleRoot = pathname === `/${locale}`;


    if (!user && !isAuthPage && !isLocaleRoot) {
      // Redirect to locale-specific login
      router.push("/login");
    } else if (user && (isAuthPage || isLocaleRoot)) {
      // Redirect to locale-specific dashboard
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
