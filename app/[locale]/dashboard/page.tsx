import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { productRepository, orderRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { can } from '@/lib/rbac/permissions';
import { formatMoney } from '@/lib/format';
import { Card } from '@/components/ui/Card';

export default async function DashboardOverviewPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = getRequestContext();

  const products = await productRepository.list(ctx);
  const orders = can(ctx.role, 'view_all_orders') ? await orderRepository.list(ctx) : [];

  const lowStockCount = products.filter((p) => p.quantityInStock <= p.lowStockThreshold).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending_review').length;
  const revenueTotal = orders.reduce((sum, o) => sum + o.totals.total, 0);

  const stats: { labelEn: string; labelAr: string; value: string }[] = [
    { labelEn: 'Products', labelAr: 'المنتجات', value: String(products.length) },
    { labelEn: 'Low stock', labelAr: 'مخزون منخفض', value: String(lowStockCount) },
    { labelEn: 'Pending orders', labelAr: 'طلبات قيد المراجعة', value: String(pendingOrders) },
    { labelEn: 'Total orders', labelAr: 'إجمالي الطلبات', value: String(orders.length) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.labelEn} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {locale === 'en' ? s.labelEn : s.labelAr}
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      {can(ctx.role, 'view_reports') && (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {locale === 'en' ? 'Total order value' : 'إجمالي قيمة الطلبات'}
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-ink">{formatMoney(revenueTotal, locale)}</p>
        </Card>
      )}
    </div>
  );
}
