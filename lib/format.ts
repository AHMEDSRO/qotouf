import type { Locale } from './i18n/config';

const CURRENCY_LABEL: Record<Locale, string> = { en: 'AED', ar: 'د.إ' };

export function formatMoney(value: number, locale: Locale): string {
  const amount = value.toLocaleString(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${CURRENCY_LABEL[locale]} ${amount}`;
}
