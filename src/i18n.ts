
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

export const locales = ['ar', 'en'];
export const defaultLocale = 'ar';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.error(`[i18n] Invalid locale: "${locale}". Triggering notFound().`);
    notFound();
  }

  let messages;
  try {
    if (locale === 'en') {
      console.log('[i18n] Attempting to load messages for: en');
      messages = (await import('./messages/en.json')).default;
      console.log('[i18n] Successfully loaded messages for: en');
    } else if (locale === 'ar') {
      console.log('[i18n] Attempting to load messages for: ar');
      messages = (await import('./messages/ar.json')).default;
      console.log('[i18n] Successfully loaded messages for: ar');
    } else {
      // Should be caught by the initial validation, but as a safeguard:
      console.error(`[i18n] Unhandled locale: "${locale}" after validation. This should not happen.`);
      notFound();
    }
  } catch (error) {
    console.error(`[i18n] CRITICAL: Failed to import message file for locale "${locale}":`, error);
    // Optional: you could re-throw or call notFound() here too if messages are absolutely critical
    // For now, we let getMessages in the layout handle the UI fallback
    throw new Error(`Failed to load messages for locale ${locale}. Cause: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    messages
  };
});
