import Link from 'next/link';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { productRepository, categoryRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { can } from '@/lib/rbac/permissions';
import { formatMoney } from '@/lib/format';
import { DataTable } from '@/components/dashboard/DataTable';
import { RoleGate } from '@/components/dashboard/RoleGate';
import { buttonVariants } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default async function DashboardProductsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  const showCost = can(ctx.role, 'view_cost_price');

  const [products, categories] = await Promise.all([productRepository.list(ctx), categoryRepository.list(ctx)]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'Products' : 'المنتجات'}</h2>
        <div className="flex gap-2">
          <RoleGate role={ctx.role} action="bulk_import_products">
            <Link href={`/${locale}/dashboard/products/import`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              {locale === 'en' ? 'Import Excel' : 'استيراد Excel'}
            </Link>
          </RoleGate>
          <RoleGate role={ctx.role} action="edit_products">
            <Link href={`/${locale}/dashboard/products/new`} className={buttonVariants({ variant: 'accent', size: 'sm' })}>
              {locale === 'en' ? 'New product' : 'منتج جديد'}
            </Link>
          </RoleGate>
        </div>
      </div>

      <DataTable
        rowKey={(p) => p.id}
        emptyMessage={locale === 'en' ? 'No products.' : 'لا يوجد منتجات.'}
        rows={products}
        columns={[
          {
            header: locale === 'en' ? 'Product' : 'المنتج',
            render: (p) => (
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="font-semibold text-ink">{p.name[locale]}</span>
                {p.quantityInStock <= p.lowStockThreshold && <Badge variant="accent">{locale === 'en' ? 'Low stock' : 'منخفض'}</Badge>}
              </div>
            ),
          },
          {
            header: locale === 'en' ? 'Category' : 'التصنيف',
            render: (p) => categories.find((c) => c.id === p.categoryId)?.name[locale] ?? '—',
          },
          { header: locale === 'en' ? 'Origin' : 'المنشأ', render: (p) => p.countryOfOrigin },
          { header: locale === 'en' ? 'Stock' : 'المخزون', render: (p) => <span className="font-mono">{p.quantityInStock}</span> },
          ...(showCost
            ? [
                {
                  header: locale === 'en' ? 'Cost' : 'التكلفة',
                  render: (p: (typeof products)[number]) =>
                    'costPrice' in p ? <span className="font-mono">{formatMoney(p.costPrice, locale)}</span> : '—',
                },
              ]
            : []),
          { header: locale === 'en' ? 'Retail' : 'القطاعي', render: (p) => <span className="font-mono">{formatMoney(p.retailPrice, locale)}</span> },
          {
            header: locale === 'en' ? 'Wholesale' : 'الجملة',
            render: (p) => (p.wholesalePrice !== null ? <span className="font-mono">{formatMoney(p.wholesalePrice, locale)}</span> : '—'),
          },
        ]}
      />
    </div>
  );
}
