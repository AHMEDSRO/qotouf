'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import { registerWholesale } from '@/lib/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterWholesalePage({ params }: { params: { locale: Locale } }) {
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
      const result = await registerWholesale({
        fullName: String(form.get('fullName')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        phone: String(form.get('phone') || '') || undefined,
        businessName: String(form.get('businessName')),
        tradeLicenseNumber: String(form.get('tradeLicenseNumber') || '') || undefined,
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
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        {locale === 'en' ? 'B2B' : 'الجملة'}
      </span>
      <h1 className="mt-2 font-display text-3xl tracking-wide text-ink">
        {locale === 'en' ? 'Register as wholesale' : 'سجل كتاجر جملة'}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        {locale === 'en'
          ? 'Instant approval — your trade license is optional and can be added later.'
          : 'الموافقة فورية — الرخصة التجارية اختيارية وممكن تضيفها بعدين.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Business name' : 'اسم المنشأة'}</label>
          <Input name="businessName" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Contact person' : 'شخص التواصل'}</label>
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
          <label className="mb-1 block text-sm font-semibold text-ink">
            {locale === 'en' ? 'Trade license number (optional)' : 'رقم الرخصة التجارية (اختياري)'}
          </label>
          <Input name="tradeLicenseNumber" />
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <Button type="submit" variant="accent" className="w-full" disabled={submitting}>
          {submitting ? '…' : locale === 'en' ? 'Create wholesale account' : 'إنشاء حساب الجملة'}
        </Button>
      </form>
    </div>
  );
}
