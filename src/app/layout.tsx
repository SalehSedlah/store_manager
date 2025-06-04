
import type { Metadata, Viewport } from 'next';
import './globals.css'; 
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";
import { DebtorsProvider } from '@/contexts/debtors-context';

// Note: Metadata here is general. Locale-specific metadata might be in [locale]/layout.tsx
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
    // The lang and dir attributes will be handled by the [locale]/layout.tsx
    <html suppressHydrationWarning> 
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
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
