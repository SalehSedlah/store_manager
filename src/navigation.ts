
import {
  Link as NextIntlLink,
  redirect as nextIntlRedirect,
  usePathname as nextIntlUsePathname,
  useRouter as nextIntlUseRouter,
  // getPathname is typically part of the object from createLocalizedPathnamesNavigation
  // If you need it, ensure your i18n.config.ts has `pathnames` correctly defined
  // and consider using createLocalizedPathnamesNavigation if that was intended.
} from 'next-intl/navigation';

// Re-export with the same names for consistent usage in the app
export const Link = NextIntlLink;
export const redirect = nextIntlRedirect;
export const usePathname = nextIntlUsePathname;
export const useRouter = nextIntlUseRouter;

// Note: If you were previously using createLocalizedPathnamesNavigation for `getPathname`
// and other advanced features, you might need to adjust.
// This setup provides the core locale-aware navigation utilities.
