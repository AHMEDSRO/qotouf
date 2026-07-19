'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Locale } from '@/lib/i18n/config';

export function AddToCartButton({
  productId,
  locale,
  disabled,
}: {
  productId: string;
  locale: Locale;
  disabled?: boolean;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(productId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex items-center gap-3">
      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        className="w-20"
        aria-label={locale === 'en' ? 'Quantity' : 'الكمية'}
      />
      <Button onClick={handleAdd} disabled={disabled} variant="accent">
        {added ? (locale === 'en' ? 'Added' : 'تمت الإضافة') : locale === 'en' ? 'Add to cart' : 'أضف للسلة'}
      </Button>
    </div>
  );
}
