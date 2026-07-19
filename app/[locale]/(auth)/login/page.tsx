'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import { setSessionUser } from '@/lib/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const DEMO_ACCOUNTS = [
  { userId: 'user-retail', labelEn: 'Retail demo account', labelAr: 'حساب تجريبي قطاعي' },
  { userId: 'user-wholesale', labelEn: 'Wholesale demo account', labelAr: 'حساب تجريبي جملة' },
];

export default function LoginPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(
      locale === 'en'
        ? 'Email/password sign-in ships with real Supabase Auth — use a demo account below for now.'
        : 'تسجيل الدخول بالإيميل هيشتغل مع Supabase Auth الحقيقي — استخدم حساب تجريبي تحت دلوقتي.'
    );
  }

  async function loginAs(userId: string) {
    await setSessionUser(userId);
    router.push(`/${locale}/account`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl tracking-wide text-ink">{locale === 'en' ? 'Log in' : 'تسجيل الدخول'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Email' : 'الإيميل'}</label>
          <Input type="email" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Password' : 'كلمة المرور'}</label>
          <Input type="password" required />
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <Button type="submit" className="w-full">
          {locale === 'en' ? 'Log in' : 'دخول'}
        </Button>
      </form>

      <div className="mt-8 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {locale === 'en' ? 'Demo accounts (Phase 1)' : 'حسابات تجريبية (الفاز 1)'}
        </p>
        <div className="mt-3 space-y-2">
          {DEMO_ACCOUNTS.map((a) => (
            <Button key={a.userId} type="button" variant="outline" className="w-full" onClick={() => loginAs(a.userId)}>
              {locale === 'en' ? a.labelEn : a.labelAr}
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        {locale === 'en' ? "Don't have an account?" : 'مفيش حساب لسه؟'}{' '}
        <Link href={`/${locale}/register`} className="font-semibold text-primary hover:underline">
          {locale === 'en' ? 'Sign up' : 'سجل دلوقتي'}
        </Link>
      </p>
    </div>
  );
}
