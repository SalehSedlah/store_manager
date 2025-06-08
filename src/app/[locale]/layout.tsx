
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server'; // Added getTranslations
import { Inter, Cairo } from 'next/font/google';
import '../globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { DebtorsProvider } from '@/contexts/debtors-context';
import { ProductsProvider } from '@/contexts/products-context';
import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', weight: ['300', '400', '500', '600', '700'], display: 'swap' });

// Metadata and Viewport can remain as they are, or be localized using generateMetadata
export const metadata: Metadata = {
  title: 'DebtVision | رؤية الديون',
  description: 'قم بإدارة ديونك برؤى مدعومة بالذكاء الاصطناعي.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' },
  ],
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<LocaleLayoutProps>) {
  let messages;
  const fontClassName = `${locale === 'ar' ? cairo.variable : inter.variable} ${locale === 'ar' ? 'font-arabic' : 'font-body'}`;
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  // Static fallback messages
  const fallbackErrorTitle = "Application Error";
  const fallbackErrorMessages = "Could not load essential internationalization messages. Please check server logs.";
  const fallbackLocaleAttempted = "Locale attempted";

  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(`[Error] Failed to load messages for locale "${locale}":`, error);
    // Fallback: render basic HTML structure with an error message
    // Using static strings here to avoid dependency on translations if they failed to load.
    return (
      <html lang={locale} dir={direction} className={fontClassName}>
        <head>
          <title>{fallbackErrorTitle}</title>
        </head>
        <body>
          <div>
            <h1>{fallbackErrorTitle}</h1>
            <p>{fallbackErrorMessages}</p>
            <p>{fallbackLocaleAttempted}: {locale}</p>
            {error instanceof Error && <pre>Error details: {error.stack || error.message}</pre>}
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale} dir={direction} className={fontClassName}>
      <head />
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <DebtorsProvider>
              <ProductsProvider>
                {children}
                <Toaster />
              </ProductsProvider>
            </DebtorsProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
