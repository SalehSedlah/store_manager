import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";
import { DebtorsProvider } from '@/contexts/debtors-context';

export const metadata: Metadata = {
  title: 'DebtVision',
  description: 'Manage your debts with AI-powered insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
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
