"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from '@/navigation'; // Use localized navigation

interface AuthContextType {
  user: User | null;
  loading: boolean;
  businessName: string | null;
  setBusinessNameInContext: (name: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessNameState] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // This will be the locale-aware pathname

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const storedBusinessName = localStorage.getItem('app_business_name_' + currentUser.uid);
        setBusinessNameState(storedBusinessName);
      } else {
        setBusinessNameState(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const setBusinessNameInContext = (name: string | null) => {
    setBusinessNameState(name);
    if (user && name) {
      localStorage.setItem('app_business_name_' + user.uid, name);
    } else if (user && name === null) {
      localStorage.removeItem('app_business_name_' + user.uid);
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    // With next-intl's router, pathname includes locale when localePrefix is 'always' or when on non-default locale with 'as-needed'.
    // We check against the base paths like '/login' or '/dashboard'.
    // The localized router.replace will handle adding the correct locale prefix.
    const isLoginPage = pathname === '/login' || pathname.endsWith('/login');
    const isSignupPage = pathname === '/signup' || pathname.endsWith('/signup');
    const isAuthPage = isLoginPage || isSignupPage;

    if (!user && !isAuthPage && !pathname.startsWith('/_next/') && pathname !== '/favicon.ico' && !pathname.endsWith('/favicon.ico')) {
      router.replace(`/login`);
    } else if (user && isAuthPage) {
      router.replace(`/dashboard`);
    }
  }, [user, loading, router, pathname]); 

  return (
    <AuthContext.Provider value={{ user, loading, businessName, setBusinessNameInContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useAuth ضمن AuthProvider");
  }
  return context;
}
