
"use client";

import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Inter, Cairo } from 'next/font/google';
import { useParams } from 'next/navigation';
import { defaultLocale, locales } from '@/i18n';
import { AuthProvider } from '@/contexts/auth-context';
import { DebtorsProvider } from '@/contexts/debtors-context';

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
  const messages = useMessages();

  const fontClassName = validatedLocale === 'ar' ? cairo.variable : inter.variable;
  const bodyFontClassName = validatedLocale === 'ar' ? 'font-arabic' : 'font-body';

  return (
    <NextIntlClientProvider locale={validatedLocale} messages={messages}>
      <AuthProvider>
        <DebtorsProvider>
          {/* The div with lang, dir, and font classes should wrap the actual page content */}
          {/* The <html> and <body> tags are in the root layout */}
          <div lang={validatedLocale} dir={validatedLocale === 'ar' ? 'rtl' : 'ltr'} className={`${fontClassName} ${bodyFontClassName}`}>
            {children}
          </div>
        </DebtorsProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
