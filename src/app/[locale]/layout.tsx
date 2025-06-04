
"use client"; // This layout is a client component to use hooks like useMessages

import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Inter, Cairo } from 'next/font/google'; // Import Cairo
import { useParams } from 'next/navigation'; // Use next/navigation for useParams

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', weight: ['300', '400', '500', '600', '700'] });


export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const messages = useMessages();

  const fontClassName = locale === 'ar' ? cairo.variable : inter.variable;
  const bodyFontClassName = locale === 'ar' ? 'font-arabic' : 'font-body';


  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* The html and body tags are in the root layout (src/app/layout.tsx) */}
      {/* This component just returns its children, wrapped by the provider */}
      {/* We'll apply font classes to the html tag in RootLayout or via a higher-order component if needed */}
      {/* For now, assuming font is applied globally or on body in RootLayout */}
      <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${fontClassName} ${bodyFontClassName}`}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
