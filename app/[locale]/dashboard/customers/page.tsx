import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { formatMoney } from '@/lib/format';
import { DataTable } from '@/components/dashboard/DataTable';
import type { WholesaleProfile } from '@/lib/types/user';

export default async function CustomersPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = getRequestContext();
  requirePermission(ctx, 'view_reports', `/${locale}/dashboard`);

  const users = await userRepository.list(ctx);
  const wholesaleCustomers = users.filter((u): u is WholesaleProfile => u.role === 'wholesale_customer');

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'Wholesale customers' : 'عملاء الجملة'}</h2>

      <DataTable
        rowKey={(c) => c.id}
        emptyMessage={locale === 'en' ? 'No wholesale customers yet.' : 'لا يوجد عملاء جملة بعد.'}
        rows={wholesaleCustomers}
        columns={[
          {
            header: locale === 'en' ? 'Business' : 'المنشأة',
            render: (c) => (
              <div>
                <p className="font-semibold text-ink">{c.businessName}</p>
                <p className="text-xs text-ink-muted">{c.fullName}</p>
              </div>
            ),
          },
          { header: locale === 'en' ? 'Email' : 'الإيميل', render: (c) => c.email },
          {
            header: locale === 'en' ? 'Credit limit' : 'حد الائتمان',
            render: (c) => <span className="font-mono">{formatMoney(c.creditLimit.limit, locale)}</span>,
          },
          {
            header: locale === 'en' ? 'Balance due' : 'المستحق',
            render: (c) => <span className="font-mono">{formatMoney(c.creditLimit.currentBalance, locale)}</span>,
          },
          {
            header: locale === 'en' ? 'Available' : 'المتاح',
            render: (c) => <span className="font-mono">{formatMoney(c.creditLimit.availableCredit, locale)}</span>,
          },
        ]}
      />
    </div>
  );
}
