// src/i18n.config.ts
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ar';
export const localePrefix = 'as-needed'; // Options: 'as-needed', 'always', 'never'
