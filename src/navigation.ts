// src/navigation.ts
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import {locales, localePrefix, defaultLocale} from './i18n.config';

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    localePrefix,
    // pathnames: { // Example of localized pathnames
    //   '/dashboard': {
    //     en: '/dashboard',
    //     ar: '/لوحة-التحكم'
    //   },
    //   '/login': {
    //     en: '/login',
    //     ar: '/تسجيل-الدخول'
    //   }
    // }
  });
