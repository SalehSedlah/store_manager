
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google'; 

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

type Props = {
  children: ReactNode;
  params: { locale: string }; // locale param still here but won't be used for i18n
};

export async function generateMetadata({ params: { locale } }: Props) {
  console.log(`[LocaleLayout-DEBUG] generateMetadata called for locale: ${locale}`);
  return {
    title: "DebtVision", 
  };
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  console.log(`[LocaleLayout-DEBUG] Rendering LocaleLayout for locale: ${locale}`);

  return (
    <html lang="en" dir="ltr" className={`${inter.variable}`}>
        <body>
            {children}
        </body>
    </html>
  );
}
