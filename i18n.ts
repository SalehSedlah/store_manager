
import {notFound} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  console.log(`[i18n-DEBUG] Attempting to load messages for locale: ${locale} from ROOT i18n.ts`);
  if (!locales.includes(locale as any)) {
    console.error(`[i18n-DEBUG] Locale "${locale}" is not one of the supported locales (${locales.join(', ')}).`);
    notFound();
  }

  let messages;
  try {
    // Path is relative to the project root, and messages are in src/messages
    messages = (await import(`./src/messages/${locale}.json`)).default;
    console.log(`[i18n-DEBUG] Successfully loaded messages for ${locale} from ./src/messages/${locale}.json`);
  } catch (error) {
    console.error(`[i18n-DEBUG] Failed to load messages for locale ${locale} from ./src/messages/${locale}.json. Error:`, error);
    // If you want to fallback to English for missing Arabic translations, you could load English messages here.
    // For now, we'll call notFound() which will render the not-found page.
    notFound();
  }

  return {
    messages
  };
});
