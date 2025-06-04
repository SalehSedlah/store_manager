
"use client";

import { AuthProvider } from '@/contexts/auth-context';
import { DebtorsProvider } from '@/contexts/debtors-context';
import { Inter, Cairo } from 'next/font/google';
import { defaultLocale, locales } from '@/i18n'; // Assuming these are exported from src/i18n.ts

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', weight: ['300', '400', '500', '600', '700'] });

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const validatedLocale = locales.includes(params.locale) ? params.locale : defaultLocale;
  
  // Determine font based on locale for the div, not the html/body tag here.
  // The actual <html> and <body> tags are in src/app/layout.tsx
  const fontVariableClassName = validatedLocale === 'ar' ? cairo.variable : inter.variable;
  const fontBodyClassName = validatedLocale === 'ar' ? 'font-arabic' : 'font-body';

  return (
    // No NextIntlClientProvider or useMessages() here.
    // AuthProvider and DebtorsProvider are global to the locale.
    <AuthProvider>
      <DebtorsProvider>
        {/* This div applies language-specific classes and font variables for Tailwind to pick up */}
        {/* The className combines the font variable (for Tailwind to use) and the body font class */}
        <div 
          lang={validatedLocale} 
          dir={validatedLocale === 'ar' ? 'rtl' : 'ltr'} 
          className={`${fontVariableClassName} ${fontBodyClassName}`}
        >
          {children}
        </div>
      </DebtorsProvider>
    </AuthProvider>
  );
}
