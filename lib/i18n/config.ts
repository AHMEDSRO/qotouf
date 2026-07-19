export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirForLocale(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function swapLocaleInPath(pathname: string, target: Locale): string {
  const segments = pathname.split('/');
  // segments[0] is '' (leading slash), segments[1] is the current locale
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = target;
    return segments.join('/') || '/';
  }
  return `/${target}${pathname}`;
}
