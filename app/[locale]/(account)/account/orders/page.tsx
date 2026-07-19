import Link from 'next/link';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { orderRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { ORDER_STATUS_LABELS } from '@/lib/types/order';
import { formatMoney } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';

export default async function OrderHistoryPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = getRequestContext();
  const orders = await orderRepository.list(ctx);
  const sorted = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl tracking-wide text-ink">{locale === 'en' ? 'Order history' : 'سجل الطلبات'}</h1>

      {sorted.length === 0 ? (
        <p className="mt-6 text-ink-muted">{locale === 'en' ? 'No orders yet.' : 'لا يوجد طلبات بعد.'}</p>
      ) : (
        <div className="mt-6 space-y-3">
          {sorted.map((order) => (
            <Link
              key={order.id}
              href={`/${locale}/account/orders/${order.id}`}
              className="flex items-center justify-between rounded-card border border-border bg-surface p-4 hover:border-primary/50"
            >
              <div>
                <p className="font-mono font-semibold text-ink">{order.orderNumber}</p>
                <p className="text-xs text-ink-muted">{new Date(order.createdAt).toLocaleDateString(locale)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-ink">{formatMoney(order.totals.total, locale)}</span>
                <Badge variant="primary">{ORDER_STATUS_LABELS[order.status][locale]}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
