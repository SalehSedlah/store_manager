
import type { Metadata, Viewport } from 'next';
import '../globals.css'; // Path relative to src/app
import { AuthProvider } from '@/contexts/auth-context';
import { DebtorsProvider } from '@/contexts/debtors-context';
import { ProductsProvider } from '@/contexts/products-context';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Cairo } from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server'; // Import getMessages

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo', weight: ['300', '400', '500', '600', '700'], display: 'swap' });

// Generates dynamic metadata based on locale
export async function generateMetadata({params: {locale}}: {params: {locale: string}}): Promise<Metadata> {
  // const t = await getTranslations({locale, namespace: 'Metadata'}); // Assuming you have a Metadata namespace
  return {
    title: 'DebtVision | رؤية الديون', // Default or fetch localized title
    description: 'قم بإدارة ديونك برؤى مدعومة بالذكاء الاصطناعي.', // Default or fetch localized description
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: {locale: string};
}

export default async function RootLayout({ // Make the function async
  children,
  params: {locale}
}: Readonly<RootLayoutProps>) {
  const messages = await getMessages(); // Fetch messages on the server

  const isArabic = locale === 'ar';
  const fontClassName = isArabic ? `${cairo.variable} font-arabic` : `${inter.variable} font-body`;
  const direction = isArabic ? 'rtl' : 'ltr';

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
