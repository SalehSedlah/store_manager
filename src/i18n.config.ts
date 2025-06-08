
import type {Pathnames} from 'next-intl/navigation';

export const locales = ['ar', 'en'] as const;
export const defaultLocale = 'ar' as const;
export const localePrefix = 'always'; // Options: 'as-needed', 'always', 'never'

// Define pathnames for your routes. This is used by next-intl/navigation.
// If you don't have translated pathnames, you can provide a simple mapping.
export const pathnames = {
  // Root path
  '/': '/',

  // App routes
  '/dashboard': '/dashboard',
  '/debt-management': '/debt-management',
  '/products': '/products',
  '/ai-assistant': '/ai-assistant',
  '/settings': '/settings',

  // Auth routes
  '/login': '/login',
  '/signup': '/signup',
} satisfies Pathnames<typeof locales>;

export type AppPathnames = keyof typeof pathnames;
