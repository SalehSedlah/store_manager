
import type { Metadata, Viewport } from 'next';
import './globals.css';
// AuthProvider and DebtorsProvider are moved to [locale]/layout.tsx
import { Toaster } from "@/components/ui/toaster";
// Inter font is imported and applied globally via globals.css and tailwind.config.ts

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
          {/* Children will be [locale]/layout.tsx which now contains providers */}
          {children}
          <Toaster />
      </body>
    </html>
  );
}
