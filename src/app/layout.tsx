
import type { Metadata, Viewport } from 'next';
import './globals.css'; 
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";
import { DebtorsProvider } from '@/contexts/debtors-context';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'DebtVision', // Default title, will be overridden by LocaleLayout
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
    // lang and dir will be set by src/app/[locale]/layout.tsx
    <html className={`${inter.variable}`} suppressHydrationWarning> 
      <head>
        {/* Cairo font for Arabic is imported in globals.css */}
      </head>
      {/* font-body is the default, html[lang="ar"] in globals.css will target Arabic font */}
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
