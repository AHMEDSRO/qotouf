'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Product, PublicProduct } from '@/lib/types/product';
import type { DeliveryRegion } from '@/lib/types/delivery';
import type { RetailProfile, WholesaleProfile, StaffProfile } from '@/lib/types/user';
import { paymentOptionsFor } from '@/lib/orders/payment-options';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type Customer = RetailProfile | WholesaleProfile;

export function NewOrderForm({
  locale,
  action,
  customers,
  salesReps,
  products,
  regions,
  currentUserId,
  isSalesRep,
}: {
  locale: Locale;
  action: (formData: FormData) => void;
  customers: Customer[];
  salesReps: StaffProfile[];
  products: (Product | PublicProduct)[];
  regions: DeliveryRegion[];
  currentUserId: string;
  isSalesRep: boolean;
}) {
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? '');
  const selectedCustomer = customers.find((c) => c.id === customerId);
  const accountType = selectedCustomer?.role === 'wholesale_customer' ? 'wholesale' : 'retail';

  const filteredProducts = useMemo(() => products.filter((p) => p.listingType === accountType), [products, accountType]);
  const paymentOptions = useMemo(() => paymentOptionsFor(accountType, locale), [accountType, locale]);
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]?.value);

  function customerLabel(c: Customer): string {
    return c.role === 'wholesale_customer' ? c.businessName : c.fullName;
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label={locale === 'en' ? 'Customer' : 'العميل'}>
          <select
            name="customerId"
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {customerLabel(c)} ({c.role === 'wholesale_customer' ? (locale === 'en' ? 'Wholesale' : 'جملة') : locale === 'en' ? 'Retail' : 'قطاعي'})
              </option>
            ))}
          </select>
        </Field>
        <Field label={locale === 'en' ? 'Sales rep' : 'موظف المبيعات'}>
          <select
            name="salesRepId"
            defaultValue={isSalesRep ? currentUserId : ''}
            className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink"
          >
            <option value="">{locale === 'en' ? 'Unassigned' : 'غير محدد'}</option>
            {salesReps.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fullName}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label={locale === 'en' ? 'Delivery area' : 'منطقة التوصيل'}>
          <select name="deliveryRegionId" required className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink">
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name[locale]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={locale === 'en' ? 'Payment method' : 'طريقة الدفع'}>
          <select
            name="paymentMethod"
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
            className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink"
          >
            {paymentOptions.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">{locale === 'en' ? 'Line items' : 'بنود الطلب'}</p>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_100px] gap-2">
              <select name={`productId_${i}`} className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink">
                <option value="">{locale === 'en' ? '— none —' : '— بدون —'}</option>
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name[locale]} ({p.price} AED)
                  </option>
                ))}
              </select>
              <Input name={`quantity_${i}`} type="number" min={0} placeholder={locale === 'en' ? 'Qty' : 'كمية'} />
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" variant="accent">
        {locale === 'en' ? 'Create order' : 'إنشاء الطلب'}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}
