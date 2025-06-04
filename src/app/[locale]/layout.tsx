
import type { ReactNode } from 'react';

// Removed Inter font import from here, it will be in RootLayout

type Props = {
  children: ReactNode;
  params: { locale: string }; // locale param still here but won't be used for i18n
};

export async function generateMetadata({ params: { locale } }: Props) {
  console.log(`[LocaleLayout-DEBUG] generateMetadata called for locale: ${locale}`);
  // Since we removed next-intl, a static title is fine.
  // If you re-add next-intl, you'd fetch translations here.
  return {
    title: "DebtVision", 
  };
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  // This console.log is fine for debugging if needed
  console.log(`[LocaleLayout-DEBUG] Rendering LocaleLayout for locale: ${locale}`);

  // This layout should NOT render <html> or <body> tags.
  // It only provides the content for the specific locale segment.
  return <>{children}</>;
}
