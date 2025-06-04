
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const pageTitle = "Create Account";
  const pageDescription = "Join DebtVision today";
  const emailLabel = "Email";
  const emailPlaceholder = "you@example.com";
  const passwordLabel = "Password";
  const confirmPasswordLabel = "Confirm Password";
  const signupButtonText = "Sign Up";
  const loadingSignupButtonText = "Creating account...";
  const loginPromptText = "Already have an account?";
  const loginLinkText = "Login";
  const toastSignupSuccessTitle = "Signup Successful";
  const toastSignupSuccessDescription = "Redirecting to dashboard...";
  const toastSignupFailedTitle = "Signup Failed";


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      const specificError = "Passwords do not match.";
      setError(specificError);
      toast({ title: toastSignupFailedTitle, description: specificError, variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: toastSignupSuccessTitle, description: toastSignupSuccessDescription });
      router.push("/dashboard"); 
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
      toast({ title: toastSignupFailedTitle, description: errorMessage, variant: "destructive" });
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
          <form onSubmit={handleSignup} className="space-y-6">
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{confirmPasswordLabel}</Label>
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
              {loading ? loadingSignupButtonText : signupButtonText}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm">
            {loginPromptText}{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              {loginLinkText}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
