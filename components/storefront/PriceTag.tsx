import type { Locale } from '@/lib/i18n/config';
import type { ProductUnit } from '@/lib/types/product';
import { UNIT_LABELS } from '@/lib/i18n/units';
import { formatMoney } from '@/lib/format';

/**
 * The signature "market tag" price readout — set in mono to read like a
 * digital scale display, the way a stall would show weight and price.
 */
export function PriceTag({
  locale,
  retailPrice,
  wholesalePrice,
  unit,
  showWholesale,
}: {
  locale: Locale;
  retailPrice: number;
  wholesalePrice: number | null;
  unit: ProductUnit;
  showWholesale: boolean;
}) {
  const unitLabel = UNIT_LABELS[unit][locale];

  return (
    <div className="flex items-baseline gap-1.5 font-mono">
      <span className="text-lg font-semibold text-ink">{formatMoney(retailPrice, locale)}</span>
      <span className="text-xs text-ink-muted">/ {unitLabel}</span>
      {showWholesale && wholesalePrice !== null && (
        <span className="ms-2 rounded-tag bg-accent/10 px-1.5 py-0.5 text-xs font-semibold text-accent">
          {formatMoney(wholesalePrice, locale)} {locale === 'en' ? 'wholesale' : 'جملة'}
        </span>
      )}
    </div>
  );
}
