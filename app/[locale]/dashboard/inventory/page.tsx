import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { productRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { adjustStockAction } from '@/lib/dashboard/product-actions';
import { DataTable } from '@/components/dashboard/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function InventoryPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  requirePermission(ctx, 'adjust_inventory', `/${locale}/dashboard`);

  const products = await productRepository.list(ctx);
  const sorted = [...products].sort((a, b) => a.quantityInStock - b.quantityInStock);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'Inventory' : 'المخزون'}</h2>

      <DataTable
        rowKey={(p) => p.id}
        emptyMessage={locale === 'en' ? 'No products.' : 'لا يوجد منتجات.'}
        rows={sorted}
        columns={[
          {
            header: locale === 'en' ? 'Product' : 'المنتج',
            render: (p) => (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">{p.name[locale]}</span>
                {p.quantityInStock <= p.lowStockThreshold && (
                  <Badge variant="accent">{locale === 'en' ? 'Low stock' : 'منخفض'}</Badge>
                )}
              </div>
            ),
          },
          { header: locale === 'en' ? 'In stock' : 'الكمية', render: (p) => <span className="font-mono">{p.quantityInStock}</span> },
          { header: locale === 'en' ? 'Threshold' : 'حد التنبيه', render: (p) => <span className="font-mono">{p.lowStockThreshold}</span> },
          {
            header: locale === 'en' ? 'Adjust' : 'تعديل',
            render: (p) => {
              const minus = adjustStockAction.bind(null, locale, p.id);
              const plus = adjustStockAction.bind(null, locale, p.id);
              return (
                <div className="flex items-center gap-2">
                  <form action={minus}>
                    <input type="hidden" name="delta" value={-10} />
                    <Button type="submit" size="sm" variant="outline">
                      -10
                    </Button>
                  </form>
                  <form action={plus}>
                    <input type="hidden" name="delta" value={10} />
                    <Button type="submit" size="sm" variant="outline">
                      +10
                    </Button>
                  </form>
                </div>
              );
            },
          },
        ]}
      />
    </div>
  );
}
