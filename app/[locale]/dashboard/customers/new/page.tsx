import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { createCustomerAction } from '@/lib/dashboard/customer-actions';
import { NewCustomerForm } from '@/components/dashboard/NewCustomerForm';

export default async function NewCustomerPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  requirePermission(ctx, 'create_wholesale_order', `/${locale}/dashboard`);

  const action = createCustomerAction.bind(null, locale);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'New customer' : 'عميل جديد'}</h2>
      <NewCustomerForm locale={locale} action={action} />
    </div>
  );
}
