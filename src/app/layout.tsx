
import type { Metadata, Viewport } from 'next';
import './globals.css'; 
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";
import { DebtorsProvider } from '@/contexts/debtors-context';
// Inter font is imported and applied globally via globals.css and tailwind.config.ts
// No need for explicit font import here if managed that way.

export const metadata: Metadata = {
  title: 'DebtVision', 
  description: 'Manage your debts with AI-powered insights.',
};

export const viewport: Viewport = {
  themeColor: [ 
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' }, 
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' }, 
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang and dir will be set in [locale]/layout.tsx
    // The Inter font variable is available globally from globals.css if set up there
    <html> 
      <head />
      <body> 
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
