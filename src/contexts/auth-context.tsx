
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next-intl/navigation"; // Use next-intl for navigation
import { useParams } from 'next/navigation'; // Standard hook for params

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter(); 
  const pathname = usePathname(); // next-intl version
  const params = useParams(); // next/navigation version to get current locale
  const currentLocale = typeof params.locale === 'string' ? params.locale : 'en';
  
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
    
    // Pathname from next-intl/navigation does NOT include the locale
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    
    if (!user && !isAuthPage && !pathname.startsWith('/_next/') && pathname !== '/favicon.ico') { 
      router.push(`/login`, {locale: currentLocale}); 
    } else if (user && isAuthPage) {
      router.push(`/dashboard`, {locale: currentLocale}); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router, pathname, currentLocale]);

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
