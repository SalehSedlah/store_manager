
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'ar'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  console.log(`[ULTRA-DEBUG] SRC/I18N.TS IS BEING EXECUTED. Attempting to load locale: ${locale}`);
  if (!locales.includes(locale as any)) {
    console.warn(`[I18N_WARN] Invalid locale "${locale}" requested. Falling back to notFound().`);
    notFound();
  }

  let messages;
  try {
    messages = (await import(`./messages/${locale}.json`)).default;
    console.log(`[I18N_INFO] Successfully loaded messages for locale: ${locale}`);
  } catch (error) {
    console.error(`[I18N_ERROR] Could not load messages for locale: ${locale}. Error:`, error);
    // Attempt to fallback to default locale if the requested locale's messages are not found and it's not already the default
    if (locale !== defaultLocale) {
      try {
        messages = (await import(`./messages/${defaultLocale}.json`)).default;
        console.warn(`[I18N_WARN] Falling back to default locale "${defaultLocale}" messages for originally requested locale: ${locale}`);
      } catch (fallbackError) {
        console.error(`[I18N_FATAL] Could not load fallback messages for default locale "${defaultLocale}". Error:`, fallbackError);
        notFound();
      }
    } else {
      // If it's already the default locale and messages couldn't be loaded, then it's a critical issue.
      console.error(`[I18N_FATAL] Could not load messages for default locale "${defaultLocale}".`);
      notFound();
    }
  }
 
  return {
    messages
  };
});
