import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n/config';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/** Builds the `alternates.languages` map for a path shared across all locales, e.g. "/product/tomato". */
export function localizedAlternates(path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${APP_URL}/${locale}${path}`;
  }
  return { languages };
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${APP_URL}/${locale}${path}`,
      ...localizedAlternates(path),
    },
  };
}
