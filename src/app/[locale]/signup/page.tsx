"use client";

import { useState } from "react";
import { useRouter, Link } from "next-intl/navigation"; // Changed import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const t = useTranslations("SignupPage");
  const tAuth = useTranslations("AuthContext");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      const specificError = tAuth("passwordsDoNotMatch");
      setError(specificError);
      toast({ title: tAuth("signupFailedTitle"), description: specificError, variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: tAuth("signupSuccessTitle"), description: tAuth("signupSuccessDescription") });
      router.push("/dashboard"); // router from next-intl/navigation handles locale
    } catch (err: any) {
      let errorMessage = err.message;
       if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already in use.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "The password is too weak. Please use a stronger password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "The email address is not valid.";
      }
      setError(errorMessage);
      toast({ title: tAuth("signupFailedTitle"), description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center mb-8 text-primary">
        <TrendingUp className="h-10 w-10 me-3" />
        <h1 className="text-4xl font-headline font-bold">{t("brandName")}</h1>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">{t("title")}</CardTitle>
          <CardDescription className="text-center">{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("loadingSignupButton") : t("signupButton")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm">
            {t("loginPrompt")}{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {t("loginLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
