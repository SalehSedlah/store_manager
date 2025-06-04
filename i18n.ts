
import {notFound} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'ar'];

export default getRequestConfig(async ({locale}) => {
  // Add a very prominent log at the very start
  console.log(`[i18n-DEBUG_ROOT_CONFIG] EXECUTING i18n.ts getRequestConfig for locale: ${locale}`);

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as string)) {
    console.error(`[i18n-DEBUG_ROOT_CONFIG] Locale "${locale}" is not one of the supported locales (${locales.join(', ')}).`);
    notFound();
  }

  let messages;
  try {
    // Path is relative to the project root, and messages are in src/messages
    messages = (await import(`./src/messages/${locale}.json`)).default;
    console.log(`[i18n-DEBUG_ROOT_CONFIG] Successfully loaded messages for ${locale} from ./src/messages/${locale}.json`);
  } catch (error) {
    console.error(`[i18n-DEBUG_ROOT_CONFIG] Failed to load messages for locale ${locale} from ./src/messages/${locale}.json. Error:`, error);
    notFound();
  }

  return {
    messages
  };
});

