// src/navigation.ts
// Direct exports from next-intl/navigation.
// These are automatically locale-aware and work with the middleware.
export {Link, redirect, usePathname, useRouter} from 'next-intl/navigation';

// The createLocalizedPathnamesNavigation function was causing a TypeScript error.
// It's primarily used for defining custom pathnames (e.g., /en/about vs /ar/من-نحن),
// a feature not currently in use as the pathnames object was commented out.
// The locale prefixing (e.g., /en/page vs /ar/page) is handled by the middleware
// and the directly exported utilities are compatible with this.
// If custom pathnames are needed in the future, this file would need to be revisited
// and the original issue with createLocalizedPathnamesNavigation resolved.
