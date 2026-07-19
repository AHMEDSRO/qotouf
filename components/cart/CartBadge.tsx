'use client';

import { ShoppingBasket } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/cart-context';

export function CartBadge({ locale, label }: { locale: string; label: string }) {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link href={`/${locale}/cart`} aria-label={label} className="relative hover:text-accent">
      <ShoppingBasket className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -end-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 font-mono text-[10px] font-semibold text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
