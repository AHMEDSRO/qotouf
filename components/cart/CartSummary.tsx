import type { Locale } from '@/lib/i18n/config';
import type { OrderTotals } from '@/lib/types/order';
import { formatMoney } from '@/lib/format';

export function CartSummary({
  totals,
  locale,
  deliveryPending,
}: {
  totals: OrderTotals;
  locale: Locale;
  deliveryPending?: boolean;
}) {
  const rows: [string, string][] = [
    [locale === 'en' ? 'Subtotal' : 'الإجمالي الفرعي', formatMoney(totals.subtotal, locale)],
    [
      locale === 'en' ? `VAT (${totals.vatRate * 100}%)` : `ضريبة القيمة المضافة (${totals.vatRate * 100}٪)`,
      formatMoney(totals.vatAmount, locale),
    ],
    [
      locale === 'en' ? 'Delivery' : 'التوصيل',
      deliveryPending ? (locale === 'en' ? 'Calculated at checkout' : 'يُحسب عند الدفع') : formatMoney(totals.deliveryFee, locale),
    ],
  ];

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-ink-muted">
            <dt>{label}</dt>
            <dd className="font-mono">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold text-ink">
        <span>{locale === 'en' ? 'Total' : 'الإجمالي'}</span>
        <span className="font-mono">{formatMoney(totals.total, locale)}</span>
      </div>
    </div>
  );
}
