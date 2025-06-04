
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for router and pathname, to be set on client-side
  const [router, setRouter] = useState<ReturnType<typeof useRouter> | null>(null);
  const [pathname, setPathname] = useState<ReturnType<typeof usePathname> | null>(null);
  
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
    setRouter(useRouter());
    setPathname(usePathname());
  }, []); 

  // Effect for redirection logic, depends on auth state and navigation tools
  useEffect(() => {
    if (loading || !router || !pathname) {
      return;
    }
    
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    
    if (!user && !isAuthPage) {
      router.push("/login");
    } else if (user && isAuthPage) {
      router.push("/dashboard");
    }
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
