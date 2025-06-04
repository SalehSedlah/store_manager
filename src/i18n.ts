
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Define the locales directly in this file or import from a shared config.
const locales = ['en', 'ar'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid.
  if (!locales.includes(locale as any)) {
    notFound();
  }

  try {
    // Assumes i18n.ts is in src/ and messages are in src/messages/
    return {
      messages: (await import(`./messages/${locale}.json`)).default
    };
  } catch (error) {
    // This error means the specific messages file (e.g., en.json) is missing or unreadable.
    console.error(`Could not load messages for locale "${locale}". Make sure src/messages/${locale}.json exists and is valid. Error: ${error}`);
    notFound();
  }
});

