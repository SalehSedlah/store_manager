
import type { ReactNode } from 'react';

// This layout is simplified as next-intl is removed.
// The RootLayout in src/app/layout.tsx now handles html and body tags.

export async function generateMetadata() {
  return {
    title: "DebtVision", // Static title
  };
}

export default function LocaleLayout({ children }: { children: ReactNode; params: { locale: string } }) {
  // No NextIntlClientProvider needed
  return <>{children}</>;
}
