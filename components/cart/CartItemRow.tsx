'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Product, PublicProduct } from '@/lib/types/product';
import { UNIT_LABELS } from '@/lib/i18n/units';
import { formatMoney } from '@/lib/format';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/lib/cart/cart-context';

export function CartItemRow({
  product,
  quantity,
  unitPrice,
  lineTotal,
  locale,
}: {
  product: Product | PublicProduct;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  locale: Locale;
}) {
  const { setQuantity, removeItem } = useCart();
  const image = product.images[0];

  return (
    <div className="flex items-center gap-4 border-b border-border py-4">
      <Link href={`/${locale}/product/${product.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-tag bg-surface-muted">
        {image && (
          <Image src={image.url} alt={locale === 'ar' ? image.altAr : image.altEn} fill className="object-cover" sizes="64px" />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/${locale}/product/${product.slug}`} className="font-semibold text-ink hover:text-primary">
          {product.name[locale]}
        </Link>
        <p className="font-mono text-xs text-ink-muted">
          {formatMoney(unitPrice, locale)} / {UNIT_LABELS[product.unit][locale]}
        </p>
      </div>

      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(product.id, Math.max(1, Number(e.target.value)))}
        className="w-16"
        aria-label={locale === 'en' ? 'Quantity' : 'الكمية'}
      />

      <span className="w-24 shrink-0 text-end font-mono font-semibold text-ink">{formatMoney(lineTotal, locale)}</span>

      <button
        type="button"
        onClick={() => removeItem(product.id)}
        aria-label={locale === 'en' ? 'Remove' : 'إزالة'}
        className="text-ink-muted hover:text-accent"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
