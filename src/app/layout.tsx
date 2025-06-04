
import type { Metadata, Viewport } from 'next';
import './globals.css'; 
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";
import { DebtorsProvider } from '@/contexts/debtors-context';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'DebtVision', 
  description: 'Manage your debts with AI-powered insights.',
};

export const viewport: Viewport = {
  themeColor: [ 
    { media: '(prefers-color-scheme: light)', color: 'hsl(198 88% 94.1%)' }, 
    { media: '(prefers-color-scheme: dark)', color: 'hsl(210 20% 12%)' }, 
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable}`} suppressHydrationWarning> 
      <head />
      <body className={'font-body antialiased'}> 
          <AuthProvider>
            <DebtorsProvider>
              {children}
            </DebtorsProvider>
          </AuthProvider>
          <Toaster />
      </body>
    </html>
  );
}
