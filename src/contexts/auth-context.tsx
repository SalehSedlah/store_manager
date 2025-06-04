
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next-intl/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Expose router and pathname if other parts of the app might need them via this context
  // Otherwise, components can import them directly from next-intl/navigation
  // For now, keeping it internal to AuthProvider's logic.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Call hooks at the top level of the client component
  const router = useRouter(); 
  const pathname = usePathname();
  
  // Effect to initialize Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Effect for redirection logic
  useEffect(() => {
    if (loading) { 
      return;
    }
    
    // For next-intl, pathname will include the locale.
    // We need to check if the current path *ends* with /login or /signup,
    // or is exactly /login or /signup if no locale prefix is used (depends on middleware config)
    const isAuthPage = pathname.endsWith("/login") || pathname.endsWith("/signup");
    
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
