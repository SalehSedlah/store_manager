
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Inter, Cairo } from 'next/font/google';
import '../globals.css'; // Assuming globals.css is one level up from [locale]
import { AuthProvider } from '@/contexts/auth-context';
import { DebtorsProvider } from '@/contexts/debtors-context';
import { ProductsProvider } from '@/contexts/products-context';
import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from 'next';

// Font setup (copied from the non-locale layout)
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', weight: ['300', '400', '500', '600', '700'], display: 'swap' });

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
  const fontClassName = `${cairo.variable} font-arabic ${inter.variable} font-body`;
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(`[Error] Failed to load messages for locale "${locale}":`, error);
    // Fallback: render basic HTML structure with an error message
    // This ensures the function still returns a valid React renderable output (JSX)
    return (
      <html lang={locale} dir={direction} className={fontClassName}>
        <head>
          <title>Application Error</title>
        </head>
        <body>
          <div>
            <h1>Application Error</h1>
            <p>Could not load essential internationalization messages. Please check server logs.</p>
            <p>Locale attempted: {locale}</p>
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
