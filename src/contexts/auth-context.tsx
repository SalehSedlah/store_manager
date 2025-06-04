
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation"; // Ensure using next/navigation

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
    
    // Simplified routing logic as [locale] might become just 'en' or be removed later
    const isAuthPage = pathname.endsWith("/login") || pathname.endsWith("/signup"); 
    
    if (!user && !isAuthPage && !pathname.startsWith('/_next/') && pathname !== '/favicon.ico') { 
      const targetPath = pathname.includes("login") || pathname.includes("signup") ? pathname : "/login";
      router.push(targetPath.startsWith("/en/") ? targetPath : `/en${targetPath}`);
    } else if (user && isAuthPage) {
      router.push("/en/dashboard"); // Assuming 'en' will be the locale segment for now
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router, pathname]);

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
