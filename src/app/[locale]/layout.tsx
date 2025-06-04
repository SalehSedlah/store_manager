import type { Metadata, Viewport } from 'next';
import '../globals.css'; // Adjusted path assuming globals.css is in src/app
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";
import { DebtorsProvider } from '@/contexts/debtors-context';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// It's good practice to define params type
interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

// Asynchronously generate metadata
export async function generateMetadata({ params: { locale } }: Pick<RootLayoutProps, 'params'>): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'RootLayout' });
 
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export const viewport: Viewport = {
  themeColor: [ // Example theme color for light and dark mode
    { media: '(prefers-color-scheme: light)', color: 'hsl(198 88% 94.1%)' }, // --background HSL
    { media: '(prefers-color-scheme: dark)', color: 'hsl(210 20% 12%)' }, // dark --background HSL
  ],
}

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<RootLayoutProps>) {
  const messages = useMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {locale === 'ar' ? (
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet" />
        ) : (
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        )}
      </head>
      <body className={locale === 'ar' ? 'font-arabic antialiased' : 'font-body antialiased'}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <DebtorsProvider>
              {children}
            </DebtorsProvider>
          </AuthProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
