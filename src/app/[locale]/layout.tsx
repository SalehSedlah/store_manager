
import type { ReactNode } from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server'; // For metadata
import { Inter } from 'next/font/google'; // Example, ensure you have fonts for AR if needed

// If you have a specific Arabic font, import it here
// import { Cairo } from 'next/font/google'; 
// const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' });

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'App' });
  return {
    title: t('name'),
  };
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();

  return (
    // The outer <html> and <body> are in the non-localized src/app/layout.tsx
    // This component focuses on providing the i18n context
    // lang and dir are set on the <html> tag in the parent RootLayout now adapted for i18n
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${inter.variable}`}>
        <body>
            <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </body>
    </html>
  );
}
