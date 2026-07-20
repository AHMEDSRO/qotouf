import Link from 'next/link';
import { ShoppingCart, DollarSign, Users, PackageX, AlertTriangle } from 'lucide-react';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { productRepository, orderRepository, userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { can } from '@/lib/rbac/permissions';
import { formatMoney } from '@/lib/format';
import { monthlySales, monthlyMargin, orderStatusBreakdown, recentActivity } from '@/lib/reports/aggregations';
import { ORDER_STATUS_LABELS } from '@/lib/types/order';
import { SalesBarChart } from '@/components/dashboard/SalesBarChart';
import { OrderStatusDonut } from '@/components/dashboard/OrderStatusDonut';
import { MarginLineChart } from '@/components/dashboard/MarginLineChart';
import { DataTable } from '@/components/dashboard/DataTable';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export default async function DashboardOverviewPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  const canViewReports = can(ctx.role, 'view_reports');
  const canViewMargin = can(ctx.role, 'view_cost_price');

  const [products, orders, users] = await Promise.all([
    productRepository.list(ctx),
    can(ctx.role, 'view_all_orders') ? orderRepository.list(ctx) : Promise.resolve([]),
    canViewReports ? userRepository.list(ctx).catch(() => []) : Promise.resolve([]),
  ]);

  const now = new Date();
  const todayOrders = orders.filter((o) => isSameDay(new Date(o.createdAt), now));
  const monthOrders = orders.filter((o) => isSameMonth(new Date(o.createdAt), now));
  const monthSales = round2Sum(monthOrders.map((o) => o.totals.total));
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const newCustomers = users.filter((u) => (u.role === 'retail_customer' || u.role === 'wholesale_customer') && new Date(u.createdAt) >= weekAgo);
  const lowStockProducts = products.filter((p) => p.quantityInStock <= p.lowStockThreshold);
  const nearLimitWholesale = users.filter(
    (u) => u.role === 'wholesale_customer' && u.creditLimit.limit > 0 && u.creditLimit.currentBalance >= u.creditLimit.limit * 0.9
  );
  const pendingConfirmationOrders = orders.filter((o) => o.paymentMethod === 'bank_transfer' && o.paymentStatus === 'pending_confirmation');

  const kpis = [
    { icon: ShoppingCart, labelEn: "Today's orders", labelAr: 'أوردرات اليوم', value: String(todayOrders.length) },
    { icon: DollarSign, labelEn: 'Sales this month', labelAr: 'مبيعات الشهر', value: formatMoney(monthSales, locale) },
    { icon: Users, labelEn: 'New customers (7d)', labelAr: 'عملاء جدد (7 أيام)', value: String(newCustomers.length) },
    { icon: PackageX, labelEn: 'Low stock', labelAr: 'مخزون منخفض', value: String(lowStockProducts.length) },
  ];

  const salesData = canViewReports ? monthlySales(orders) : [];
  const activity = canViewReports ? recentActivity(orders, users, locale) : [];
  const statusData = canViewReports ? orderStatusBreakdown(orders, locale) : [];
  const marginData =
    canViewMargin
      ? monthlyMargin(
          orders,
          products.filter((p): p is typeof p & { costPrice: number } => 'costPrice' in p)
        )
      : [];

  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((s) => (
          <Card key={s.labelEn} className="p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-tag bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{locale === 'en' ? s.labelEn : s.labelAr}</p>
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      {canViewReports && (
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card className="p-4">
            <p className="mb-2 text-sm font-semibold text-ink">{locale === 'en' ? 'Sales — last 12 months' : 'المبيعات — آخر 12 شهر'}</p>
            <SalesBarChart data={salesData} locale={locale} />
          </Card>
          <Card className="p-4">
            <p className="mb-2 text-sm font-semibold text-ink">{locale === 'en' ? 'Recent activity' : 'آخر النشاط'}</p>
            <div className="space-y-3">
              {activity.length === 0 ? (
                <p className="text-sm text-ink-muted">{locale === 'en' ? 'Nothing yet.' : 'لا يوجد نشاط بعد.'}</p>
              ) : (
                activity.map((a, i) => (
                  <Link key={i} href={`/${locale}${a.link}`} className="block hover:underline">
                    <p className="text-sm font-semibold text-ink">{a.label}</p>
                    <p className="text-xs text-ink-muted">
                      {a.sublabel} · {new Date(a.at).toLocaleDateString(locale)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {(lowStockProducts.length > 0 || nearLimitWholesale.length > 0 || pendingConfirmationOrders.length > 0) && (
        <div className="space-y-2">
          {lowStockProducts.length > 0 && (
            <AlertBanner
              icon={AlertTriangle}
              text={
                locale === 'en'
                  ? `${lowStockProducts.length} product(s) are low on stock.`
                  : `${lowStockProducts.length} منتج مخزونه منخفض.`
              }
              href={`/${locale}/dashboard/inventory`}
              linkText={locale === 'en' ? 'View inventory' : 'عرض المخزون'}
            />
          )}
          {nearLimitWholesale.length > 0 && (
            <AlertBanner
              icon={AlertTriangle}
              text={
                locale === 'en'
                  ? `${nearLimitWholesale.length} wholesale customer(s) at or near their credit limit.`
                  : `${nearLimitWholesale.length} عميل جملة وصل أو قرب من حد الائتمان.`
              }
              href={`/${locale}/dashboard/customers`}
              linkText={locale === 'en' ? 'View customers' : 'عرض العملاء'}
            />
          )}
          {pendingConfirmationOrders.length > 0 && (
            <AlertBanner
              icon={AlertTriangle}
              text={
                locale === 'en'
                  ? `${pendingConfirmationOrders.length} bank-transfer order(s) awaiting payment confirmation.`
                  : `${pendingConfirmationOrders.length} أوردر تحويل بنكي بانتظار تأكيد الدفع.`
              }
              href={`/${locale}/dashboard/orders`}
              linkText={locale === 'en' ? 'Review orders' : 'مراجعة الطلبات'}
            />
          )}
        </div>
      )}

      {canViewReports && (
        <div className={`grid gap-4 ${canViewMargin ? 'lg:grid-cols-2' : ''}`}>
          <Card className="p-4">
            <p className="mb-2 text-sm font-semibold text-ink">{locale === 'en' ? 'Order status breakdown' : 'توزيع حالات الأوردر'}</p>
            <OrderStatusDonut data={statusData} />
          </Card>
          {canViewMargin && (
            <Card className="p-4">
              <p className="mb-2 text-sm font-semibold text-ink">{locale === 'en' ? 'Revenue vs. margin' : 'الإيراد مقابل الهامش'}</p>
              <MarginLineChart data={marginData} locale={locale} />
            </Card>
          )}
        </div>
      )}

      {canViewReports && (
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">{locale === 'en' ? 'Recent orders' : 'آخر الطلبات'}</p>
          <DataTable
            rowKey={(o) => o.id}
            emptyMessage={locale === 'en' ? 'No orders yet.' : 'لا يوجد طلبات بعد.'}
            rows={recentOrders}
            columns={[
              {
                header: locale === 'en' ? 'Order' : 'الطلب',
                render: (o) => (
                  <Link href={`/${locale}/dashboard/orders/${o.id}`} className="font-mono font-semibold text-primary hover:underline">
                    {o.orderNumber}
                  </Link>
                ),
              },
              { header: locale === 'en' ? 'Status' : 'الحالة', render: (o) => <Badge variant="primary">{ORDER_STATUS_LABELS[o.status][locale]}</Badge> },
              { header: locale === 'en' ? 'Total' : 'الإجمالي', render: (o) => <span className="font-mono">{formatMoney(o.totals.total, locale)}</span> },
              { header: locale === 'en' ? 'Date' : 'التاريخ', render: (o) => new Date(o.createdAt).toLocaleDateString(locale) },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function round2Sum(values: number[]): number {
  return Math.round(values.reduce((sum, v) => sum + v, 0) * 100) / 100;
}

function AlertBanner({
  icon: Icon,
  text,
  href,
  linkText,
}: {
  icon: typeof AlertTriangle;
  text: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-card border border-accent/30 bg-accent/5 px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-accent" />
        <p className="text-sm text-ink">{text}</p>
      </div>
      <Link href={href} className="shrink-0 text-sm font-semibold text-primary hover:underline">
        {linkText}
      </Link>
    </div>
  );
}
