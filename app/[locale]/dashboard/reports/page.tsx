import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { orderRepository, productRepository, userRepository, deliveryRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { can } from '@/lib/rbac/permissions';
import { topProductsByRevenue, marginByProduct, repPerformance, salesByRegion } from '@/lib/reports/aggregations';
import { formatMoney } from '@/lib/format';
import { DataTable } from '@/components/dashboard/DataTable';
import { Card } from '@/components/ui/Card';

export default async function ReportsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  requirePermission(ctx, 'view_reports', `/${locale}/dashboard`);

  const [orders, products, users, regions] = await Promise.all([
    orderRepository.list(ctx),
    productRepository.list(ctx),
    userRepository.list(ctx),
    deliveryRepository.list(ctx),
  ]);

  const topProducts = topProductsByRevenue(orders, locale);
  const repRows = repPerformance(orders, users);
  const regionRows = salesByRegion(orders, regions, locale);
  const showMargin = can(ctx.role, 'view_cost_price');
  const marginRows = showMargin ? marginByProduct(products.filter((p): p is typeof p & { costPrice: number } => 'costPrice' in p), locale) : [];

  return (
    <div className="space-y-8">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'Reports' : 'التقارير'}</h2>

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
          {locale === 'en' ? 'Top products by revenue' : 'أكتر المنتجات مبيعًا'}
        </h3>
        <DataTable
          rowKey={(r) => r.productId}
          emptyMessage={locale === 'en' ? 'No sales yet.' : 'لا يوجد مبيعات بعد.'}
          rows={topProducts}
          columns={[
            { header: locale === 'en' ? 'Product' : 'المنتج', render: (r) => r.name },
            { header: locale === 'en' ? 'Units sold' : 'الكمية المباعة', render: (r) => <span className="font-mono">{r.quantitySold}</span> },
            { header: locale === 'en' ? 'Revenue' : 'الإيراد', render: (r) => <span className="font-mono">{formatMoney(r.revenue, locale)}</span> },
          ]}
        />
      </section>

      {showMargin && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            {locale === 'en' ? 'Margin by product' : 'هامش الربح لكل منتج'}
          </h3>
          <DataTable
            rowKey={(r) => r.productId}
            emptyMessage={locale === 'en' ? 'No products.' : 'لا يوجد منتجات.'}
            rows={marginRows}
            columns={[
              { header: locale === 'en' ? 'Product' : 'المنتج', render: (r) => r.name },
              { header: locale === 'en' ? 'Margin' : 'الهامش', render: (r) => <span className="font-mono">{formatMoney(r.margin, locale)}</span> },
              { header: locale === 'en' ? 'Margin %' : 'نسبة الهامش', render: (r) => <span className="font-mono">{r.marginPercent}%</span> },
            ]}
          />
        </section>
      )}

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
          {locale === 'en' ? 'Sales rep performance' : 'أداء موظفي المبيعات'}
        </h3>
        <DataTable
          rowKey={(r) => r.repId}
          emptyMessage={locale === 'en' ? 'No wholesale orders assigned yet.' : 'لا يوجد طلبات جملة مربوطة بعد.'}
          rows={repRows}
          columns={[
            { header: locale === 'en' ? 'Rep' : 'الموظف', render: (r) => r.name },
            { header: locale === 'en' ? 'Orders' : 'الطلبات', render: (r) => <span className="font-mono">{r.orderCount}</span> },
            { header: locale === 'en' ? 'Revenue' : 'الإيراد', render: (r) => <span className="font-mono">{formatMoney(r.revenue, locale)}</span> },
          ]}
        />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
          {locale === 'en' ? 'Sales by region' : 'المبيعات حسب المنطقة'}
        </h3>
        <DataTable
          rowKey={(r) => r.regionId}
          emptyMessage={locale === 'en' ? 'No orders yet.' : 'لا يوجد طلبات بعد.'}
          rows={regionRows}
          columns={[
            { header: locale === 'en' ? 'Region' : 'المنطقة', render: (r) => r.name },
            { header: locale === 'en' ? 'Orders' : 'الطلبات', render: (r) => <span className="font-mono">{r.orderCount}</span> },
            { header: locale === 'en' ? 'Revenue' : 'الإيراد', render: (r) => <span className="font-mono">{formatMoney(r.revenue, locale)}</span> },
          ]}
        />
      </section>

      <Card className="p-4 text-xs text-ink-muted">
        {locale === 'en'
          ? 'Figures reflect current mock data. These aggregations run the same way once Supabase is wired in.'
          : 'الأرقام دي بتعكس البيانات التجريبية الحالية. نفس طريقة الحساب هتفضل شغالة لما نربط Supabase.'}
      </Card>
    </div>
  );
}
