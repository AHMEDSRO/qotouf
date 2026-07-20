'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { EMIRATE_LABELS } from '@/lib/types/common';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type CustomerType = 'retail_customer' | 'wholesale_customer';

export function NewCustomerForm({ locale, action }: { locale: Locale; action: (formData: FormData) => void }) {
  const [role, setRole] = useState<CustomerType>('retail_customer');

  return (
    <form action={action} className="max-w-xl space-y-4">
      <Field label={locale === 'en' ? 'Customer type' : 'نوع العميل'}>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as CustomerType)}
          className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink"
        >
          <option value="retail_customer">{locale === 'en' ? 'Retail' : 'قطاعي'}</option>
          <option value="wholesale_customer">{locale === 'en' ? 'Wholesale' : 'جملة'}</option>
        </select>
      </Field>

      {role === 'wholesale_customer' && (
        <Field label={locale === 'en' ? 'Business name' : 'اسم المنشأة'}>
          <Input name="businessName" required />
        </Field>
      )}

      <Field label={role === 'wholesale_customer' ? (locale === 'en' ? 'Contact person' : 'شخص التواصل') : locale === 'en' ? 'Full name' : 'الاسم بالكامل'}>
        <Input name="fullName" required />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={locale === 'en' ? 'Email' : 'الإيميل'}>
          <Input name="email" type="email" required />
        </Field>
        <Field label={locale === 'en' ? 'Phone' : 'الهاتف'}>
          <Input name="phone" type="tel" />
        </Field>
      </div>

      {role === 'retail_customer' ? (
        <>
          <Field label={locale === 'en' ? 'Emirate' : 'الإمارة'}>
            <select name="emirate" required className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink">
              {Object.entries(EMIRATE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label[locale]}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label={locale === 'en' ? 'Area' : 'المنطقة'}>
              <Input name="area" required />
            </Field>
            <Field label={locale === 'en' ? 'Street / address' : 'الشارع / العنوان'}>
              <Input name="street" required />
            </Field>
          </div>
        </>
      ) : (
        <Field label={locale === 'en' ? 'Trade license number (optional)' : 'رقم الرخصة التجارية (اختياري)'}>
          <Input name="tradeLicenseNumber" />
        </Field>
      )}

      <p className="text-xs text-ink-muted">
        {locale === 'en'
          ? 'The customer gets a Supabase invite email to set their own password — you never see or set it.'
          : 'هيوصل للعميل إيميل دعوة من Supabase عشان يحدد الباسورد بنفسه — أنت مش هتشوفه أو تحدده.'}
      </p>

      <Button type="submit" variant="accent">
        {locale === 'en' ? 'Create customer' : 'إنشاء العميل'}
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
