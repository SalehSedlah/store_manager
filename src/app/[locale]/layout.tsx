
import type { ReactNode } from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  console.log(`[LocaleLayout-DEBUG] generateMetadata called for locale: ${locale}`);
  // In a real app with next-intl, you'd use getTranslations here
  // For now, a static title is fine as we are re-integrating
  const title = locale === 'ar' ? "DebtVision (رؤية الديون)" : "DebtVision";
  return {
    title: title,
  };
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  console.log(`[LocaleLayout-DEBUG] Rendering LocaleLayout for locale: ${locale}`);
  const messages = useMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
