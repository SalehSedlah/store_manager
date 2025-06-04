
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Changed
import Link from "next/link"; // Changed
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";
// import { useTranslations } from "next-intl"; // Removed

export default function LoginPage() {
  // const t = useTranslations("LoginPage"); // Removed
  // const tToast = useTranslations("Toast"); // Removed
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Hardcoded strings
  const pageTitle = "Login";
  const pageDescription = "Access your DebtVision account";
  const emailLabel = "Email";
  const emailPlaceholder = "you@example.com";
  const passwordLabel = "Password";
  const loginButtonText = "Login";
  const loadingLoginButtonText = "Logging in...";
  const signupPromptText = "Don't have an account?";
  const signupLinkText = "Sign up";
  const toastLoginSuccessTitle = "Login Successful";
  const toastLoginSuccessDescription = "Redirecting to dashboard...";
  const toastLoginFailedTitle = "Login Failed";


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: toastLoginSuccessTitle, description: toastLoginSuccessDescription });
      router.push(`/dashboard`); // No locale prefix
    } catch (err: any) {
      let errorMessage = err.message;
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "The email address is not valid.";
      }
      setError(errorMessage);
      toast({ title: toastLoginFailedTitle, description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center mb-8 text-primary">
        <TrendingUp className="h-10 w-10 mr-3 rtl:ml-3 rtl:mr-0" />
        <h1 className="text-4xl font-headline font-bold">DebtVision</h1>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">{pageTitle}</CardTitle>
          <CardDescription className="text-center">{pageDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{emailLabel}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder}
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? loadingLoginButtonText : loginButtonText}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm">
            {signupPromptText}{" "}
            <Link href={`/signup`} className="font-medium text-primary hover:underline">
              {signupLinkText}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
