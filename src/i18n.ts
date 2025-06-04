
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation'; // Corrected import

export const locales = ['en', 'ar'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // For testing, log when this file is accessed
  console.log(`[ULTRA-DEBUG] SRC/I18N.TS: Loading messages for locale: ${locale}`);

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
