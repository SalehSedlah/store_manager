import type { Metadata, Viewport } from 'next';
import '../globals.css'; 
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from "@/components/ui/toaster";
import { DebtorsProvider } from '@/contexts/debtors-context';
import { NextIntlClientProvider } from 'next-intl'; // Keep this for the provider component
import { getMessages, getTranslations } from 'next-intl/server'; // Import getMessages

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Pick<RootLayoutProps, 'params'>): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'RootLayout' });
 
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export const viewport: Viewport = {
  themeColor: [ 
    { media: '(prefers-color-scheme: light)', color: 'hsl(198 88% 94.1%)' }, 
    { media: '(prefers-color-scheme: dark)', color: 'hsl(210 20% 12%)' }, 
  ],
}

export default async function RootLayout({ // Make the component async
  children,
  params: { locale }
}: Readonly<RootLayoutProps>) {
  const messages = await getMessages(); // Load messages on the server

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
        <NextIntlClientProvider locale={locale} messages={messages}> {/* Pass server-loaded messages */}
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
