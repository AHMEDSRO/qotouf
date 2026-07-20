import type { Locale } from '@/lib/i18n/config';
import type { PaymentMethod } from '@/lib/types/order';
import type { AccountType } from '@/lib/pricing/pricing';

export interface PaymentOption {
  value: PaymentMethod;
  label: string;
  disabled?: boolean;
}

/** The payment methods offered per channel — retail never sees bank transfer/credit, wholesale never sees only-cash-or-card. */
export function paymentOptionsFor(accountType: AccountType, locale: Locale): PaymentOption[] {
  if (accountType === 'wholesale') {
    return [
      { value: 'invoice_credit', label: locale === 'en' ? 'Invoice / credit account' : 'فاتورة آجلة' },
      { value: 'bank_transfer', label: locale === 'en' ? 'Bank transfer' : 'تحويل بنكي' },
      { value: 'cash', label: locale === 'en' ? 'Cash' : 'كاش' },
      { value: 'card', label: locale === 'en' ? 'Card (Stripe — coming soon)' : 'بطاقة (Stripe — قريبًا)', disabled: true },
    ];
  }
  return [
    { value: 'cash', label: locale === 'en' ? 'Cash on delivery' : 'كاش عند الاستلام' },
    { value: 'card', label: locale === 'en' ? 'Card (Stripe — coming soon)' : 'بطاقة (Stripe — قريبًا)', disabled: true },
  ];
}
