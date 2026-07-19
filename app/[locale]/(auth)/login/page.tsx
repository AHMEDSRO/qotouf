'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import { signIn } from '@/lib/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await signIn(String(form.get('email')), String(form.get('password')));
      router.push(`/${locale}/account`);
      router.refresh();
    } catch {
      setError(locale === 'en' ? 'Incorrect email or password.' : 'الإيميل أو كلمة المرور غلط.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl tracking-wide text-ink">{locale === 'en' ? 'Log in' : 'تسجيل الدخول'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Email' : 'الإيميل'}</label>
          <Input name="email" type="email" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Password' : 'كلمة المرور'}</label>
          <Input name="password" type="password" required />
        </div>
        {error && <p className="text-sm text-accent">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? '…' : locale === 'en' ? 'Log in' : 'دخول'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-muted">
        {locale === 'en' ? "Don't have an account?" : 'مفيش حساب لسه؟'}{' '}
        <Link href={`/${locale}/register`} className="font-semibold text-primary hover:underline">
          {locale === 'en' ? 'Sign up' : 'سجل دلوقتي'}
        </Link>
      </p>
    </div>
  );
}
