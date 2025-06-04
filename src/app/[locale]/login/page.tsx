
"use client";

import { useState } from "react";
import { useRouter, Link } from "next-intl/navigation"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from 'next/navigation'; // Standard hook for params

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const tToast = useTranslations("Toast");
  const params = useParams(); // Get locale from here
  const locale = typeof params.locale === 'string' ? params.locale : 'en';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const pageTitle = t("title");
  const pageDescription = t("description");
  const emailLabel = t("emailLabel");
  const emailPlaceholder = t("emailPlaceholder");
  const passwordLabel = t("passwordLabel");
  const loginButtonText = t("loginButton");
  const loadingLoginButtonText = t("loadingLoginButton");
  const signupPromptText = t("signupPrompt");
  const signupLinkText = t("signupLink");
  const toastLoginSuccessTitle = tToast("loginSuccessTitle");
  const toastLoginSuccessDescription = tToast("loginSuccessDescription");
  const toastLoginFailedTitle = tToast("loginFailedTitle");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: toastLoginSuccessTitle, description: toastLoginSuccessDescription });
      router.push(`/${locale}/dashboard`); 
    } catch (err: any) {
      let errorMessage = err.message;
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password."; // Consider translating this as well
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "The email address is not valid."; // And this
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
        <h1 className="text-4xl font-headline font-bold">{t("App.name")}</h1>
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
                className="bg-white dark:bg-input"
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
                className="bg-white dark:bg-input"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? loadingLoginButtonText : loginButtonText}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm">
            {signupPromptText}{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              {signupLinkText}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
