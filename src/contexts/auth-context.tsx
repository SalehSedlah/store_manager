
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname, useParams } from "next-intl/client"; // Changed to next-intl/client for useParams
// For Link, use next-intl/link if you need locale-aware links

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
  const params = useParams();
  const locale = params && typeof params.locale === 'string' ? params.locale : 'en';
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || !router || !pathname) { 
      return;
    }
    
    // pathname from next-intl/navigation does not include locale, so we check raw pathname for auth pages
    const rawPathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const isAuthPage = rawPathname.endsWith("/login") || rawPathname.endsWith("/signup"); 
    
    if (!user && !isAuthPage && !rawPathname.startsWith('/_next/') && rawPathname !== '/favicon.ico') { 
      // useRouter from next-intl will handle locale prefixing
      router.push("/login");
    } else if (user && isAuthPage) {
      router.push("/dashboard");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router, pathname, locale]); // Added locale to dependency array

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
