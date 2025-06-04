
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.error(`[i18n] Invalid locale provided to getRequestConfig: "${locale}". Supported locales are: ${locales.join(', ')}. Calling notFound().`);
    notFound();
  }

  try {
    // Using @/ to ensure the path is resolved from the src directory
    // This relies on the tsconfig.json paths alias.
    const messages = (await import(`@/messages/${locale}.json`)).default;
    // console.log(`[i18n] Successfully loaded messages for locale "${locale}" using alias path.`);
    return {
      messages
    };
  } catch (error) {
    console.error(`[i18n] Critical error: Failed to load messages for locale "${locale}" using alias path "@/messages/${locale}.json". This is likely the cause of "Couldn't find next-intl config file" or subsequent errors. Please check if the file exists and if path aliases are correctly resolved by the build system. Error details: ${error}`);
    // If the primary import fails, call notFound.
    // This is a critical failure if messages can't be loaded.
    notFound();
  }
});
