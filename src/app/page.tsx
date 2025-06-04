
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n'; // Assuming your i18n.ts exports defaultLocale

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
