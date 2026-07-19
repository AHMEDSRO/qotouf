'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { signOut } from '@/lib/auth/actions';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/lib/i18n/config';

export function SignOutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
      router.push(`/${locale}`);
      router.refresh();
    });
  }

  return (
    <Button type="button" variant="ghost" onClick={handleSignOut} disabled={isPending}>
      {locale === 'en' ? 'Log out' : 'تسجيل الخروج'}
    </Button>
  );
}
