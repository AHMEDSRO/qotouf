import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { userRepository, productRepository, deliveryRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { createOrderAction } from '@/lib/dashboard/order-actions';
import { NewOrderForm } from '@/components/dashboard/NewOrderForm';
import type { RetailProfile, WholesaleProfile, StaffProfile, UserProfile } from '@/lib/types/user';

export default async function NewOrderPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  requirePermission(ctx, 'create_wholesale_order', `/${locale}/dashboard`);

  const [users, products, regions] = await Promise.all([
    userRepository.list(ctx).catch((): UserProfile[] => []),
    productRepository.list(ctx),
    deliveryRepository.list(ctx),
  ]);
  const customers: (RetailProfile | WholesaleProfile)[] = users.filter(
    (u): u is RetailProfile | WholesaleProfile => u.role === 'retail_customer' || u.role === 'wholesale_customer'
  );
  const salesReps: StaffProfile[] = users.filter((u): u is StaffProfile => u.role === 'sales_rep');

  const action = createOrderAction.bind(null, locale);

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'New order' : 'أوردر جديد'}</h2>

      {customers.length === 0 ? (
        <p className="text-sm text-ink-muted">
          {locale === 'en' ? 'No customers yet — add one first.' : 'لا يوجد عملاء بعد — ضيف عميل الأول.'}
        </p>
      ) : (
        <NewOrderForm
          locale={locale}
          action={action}
          customers={customers}
          salesReps={salesReps}
          products={products}
          regions={regions}
          currentUserId={ctx.userId}
          isSalesRep={ctx.role === 'sales_rep'}
        />
      )}
    </div>
  );
}
