
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next-intl/server'; // Correct import for notFound

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
  console.log(`[i18n-DEBUG] Loading messages for locale: ${locale}`);

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    console.log(`[i18n-DEBUG] Successfully loaded messages for ${locale}`);
    return {
      messages
    };
  } catch (error) {
    console.error(`[i18n-DEBUG] Failed to load messages for ${locale}:`, error);
    // Fallback or re-throw, depending on how you want to handle missing message files
    // For now, let it throw if a message file is genuinely missing for a supported locale.
    // If you want to fall back to English for missing Arabic translations, you'd load English messages here.
    notFound(); 
  }
});
