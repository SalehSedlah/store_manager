
import type { ReactNode } from 'react';
// import { NextIntlClientProvider, useMessages } from 'next-intl'; // Removed
// import { getMessages, getTranslations } from 'next-intl/server'; // Removed
import { Inter } from 'next/font/google'; 

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

type Props = {
  children: ReactNode;
  params: { locale: string }; // Locale param still here but won't be used for i18n
};

export async function generateMetadata({ params: { locale } }: Props) {
  console.log(`[LocaleLayout-DEBUG] generateMetadata called for locale: ${locale}`);
  // const t = await getTranslations({ locale, namespace: 'App' }); // Removed
  return {
    title: "DebtVision (Static)", // Hardcoded title
  };
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  // const messages = useMessages(); // Removed
  console.log(`[LocaleLayout-DEBUG] Rendering LocaleLayout for locale: ${locale}`);

  return (
    <html lang="en" dir="ltr" className={`${inter.variable}`}>
        <body>
            {/* <NextIntlClientProvider locale={locale} messages={messages}> */}
                {children}
            {/* </NextIntlClientProvider> */}
        </body>
    </html>
  );
}
