
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  businessName: string | null; // Added businessName
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState<string | null>(null); // State for business name
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Try to load business name from localStorage
        const storedBusinessName = localStorage.getItem('app_business_name_' + currentUser.uid);
        setBusinessName(storedBusinessName);
      } else {
        setBusinessName(null); // Clear business name if no user
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (!user && !isAuthPage && !pathname.startsWith('/_next/') && pathname !== '/favicon.ico') {
      router.replace(`/login`);
    } else if (user && isAuthPage) {
      router.replace(`/dashboard`);
    }
  }, [user, loading, router, pathname]); 

  return (
    <AuthContext.Provider value={{ user, loading, businessName }}>
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
