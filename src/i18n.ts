
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { locales } from './i18n.config'; // Ensure path is correct

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.error(`[i18n-diag] Invalid locale: "${locale}". Triggering notFound().`);
    notFound(); // This is standard next-intl practice for invalid locales.
  }

  // For this diagnostic, we'll return very simple, static messages
  // to avoid issues with dynamic imports of JSON files for now.
  console.log(`[i18n-diag] Configuring for locale: ${locale} with static messages.`);

  let messages;
  if (locale === 'en') {
    messages = {
      "LocaleRootPage": {
        "loadingText": "Loading..."
      },
      "RootLayout": {
        "applicationErrorTitle": "Application Error (Static EN)",
        "applicationErrorMessages": "Could not load essential internationalization messages (Static EN). Please check server logs.",
        "localeAttempted": "Locale attempted (Static EN)"
      }
    };
  } else if (locale === 'ar') {
    messages = {
      "LocaleRootPage": {
        "loadingText": "جاري التحميل..."
      },
      "RootLayout": {
        "applicationErrorTitle": "خطأ في التطبيق (ثابت عربي)",
        "applicationErrorMessages": "تعذر تحميل رسائل التدويل الأساسية (ثابت عربي). يرجى مراجعة سجلات الخادم.",
        "localeAttempted": "اللغة المطلوبة (ثابت عربي)"
      }
    };
  } else {
    // This case should ideally not be reached if the locales array and validation are correct.
    // Providing a default empty messages object as a safeguard.
    console.warn(`[i18n-diag] Locale "${locale}" was valid but not explicitly handled for static messages. Returning empty messages.`);
    messages = {};
  }

  return {
    messages
  };
});
