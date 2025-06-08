
import { AuthProvider } from '@/contexts/auth-context';
import { DebtorsProvider } from '@/contexts/debtors-context';
import { ProductsProvider } from '@/contexts/products-context';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Cairo } from 'next/font/google';
import React from 'react'; // Import React
import '../globals.css'; // Path to globals.css from app/[locale]/

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', weight: ['300', '400', '500', '600', '700'], display: 'swap' });

export const metadata = {
  title: 'DebtVision (Fallback Layout)',
  description: 'Fallback layout for DebtVision.',
};

export default function LocaleLayout({
  children,
  params: paramsPromise // params is now treated as a Promise
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Updated type to reflect it's a Promise
}) {
  const params = React.use(paramsPromise); // Unwrap the promise to get the params object

  // Default to Arabic font and RTL direction, ignoring locale as i18n was removed.
  const fontClassName = `${cairo.variable} font-arabic`;
  const direction = 'rtl';

  console.warn(
    `[Warning] Fallback layout /src/app/[locale]/layout.tsx rendered for locale: '${params.locale}'. ` +
    `This file path should ideally not be active after i18n removal. ` +
    `Please ensure Next.js is routing to /app/layout.tsx.`
  );

  return (
    <html lang="ar" dir={direction} className={fontClassName}>
      <head />
      <body>
        <AuthProvider>
          <DebtorsProvider>
            <ProductsProvider>
              {children}
              <Toaster />
            </ProductsProvider>
          </DebtorsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
