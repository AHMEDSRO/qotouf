'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import { EMIRATE_LABELS } from '@/lib/types/common';
import { registerRetail } from '@/lib/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterRetailPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const result = await registerRetail({
        fullName: String(form.get('fullName')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        phone: String(form.get('phone') || '') || undefined,
        emirate: String(form.get('emirate')),
        area: String(form.get('area')),
        street: String(form.get('street')),
        locale,
      });
      if (result.needsEmailConfirmation) {
        setConfirmEmailSent(true);
      } else {
        router.push(`/${locale}/account`);
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : locale === 'en' ? 'Could not create account.' : 'تعذر إنشاء الحساب.');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmEmailSent) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <h1 className="font-display text-2xl tracking-wide text-ink">
          {locale === 'en' ? 'Check your email' : 'راجع إيميلك'}
        </h1>
        <p className="mt-2 text-ink-muted">
          {locale === 'en'
            ? 'We sent a confirmation link — click it to activate your account, then log in.'
            : 'بعتنالك لينك تأكيد — دوس عليه عشان تفعّل حسابك، وبعدين سجل دخول.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl tracking-wide text-ink">
        {locale === 'en' ? 'Create your account' : 'إنشاء حساب'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Full name' : 'الاسم بالكامل'}</label>
          <Input name="fullName" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Email' : 'الإيميل'}</label>
          <Input name="email" type="email" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Password' : 'كلمة المرور'}</label>
          <Input name="password" type="password" required minLength={8} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Phone' : 'الهاتف'}</label>
          <Input name="phone" type="tel" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Emirate' : 'الإمارة'}</label>
          <select name="emirate" required className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink">
            {Object.entries(EMIRATE_LABELS).map(([code, label]) => (
              <option key={code} value={code}>
                {label[locale]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Area' : 'المنطقة'}</label>
          <Input name="area" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Street / address' : 'الشارع / العنوان'}</label>
          <Input name="street" required />
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? '…' : locale === 'en' ? 'Create account' : 'إنشاء الحساب'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-muted">
        {locale === 'en' ? 'Buying for a business?' : 'بتشتري لشركة؟'}{' '}
        <Link href={`/${locale}/register/wholesale`} className="font-semibold text-primary hover:underline">
          {locale === 'en' ? 'Register as wholesale' : 'سجل كتاجر جملة'}
        </Link>
      </p>
    </div>
  );
}
