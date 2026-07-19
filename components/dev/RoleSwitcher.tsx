'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setSessionUser, clearSession } from '@/lib/auth/actions';
import { ROLE_LABELS, type Role } from '@/lib/rbac/roles';
import type { Locale } from '@/lib/i18n/config';

const ACCOUNTS: { userId: string; role: Role }[] = [
  { userId: 'user-super-admin', role: 'super_admin' },
  { userId: 'user-admin', role: 'admin' },
  { userId: 'user-accountant', role: 'accountant' },
  { userId: 'user-sales-rep', role: 'sales_rep' },
  { userId: 'user-warehouse', role: 'warehouse' },
  { userId: 'user-retail', role: 'retail_customer' },
  { userId: 'user-wholesale', role: 'wholesale_customer' },
];

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Dev-only mock auth widget — lets you switch between the 7 seeded accounts to
 * exercise role-gated UI without real Supabase Auth. Remove once real auth ships.
 */
export function RoleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentUserId, setCurrentUserId] = useState<string>('guest');

  useEffect(() => {
    setCurrentUserId(readCookie('qtouf_user') ?? 'guest');
  }, []);

  function handleChange(userId: string) {
    setCurrentUserId(userId);
    startTransition(async () => {
      if (userId === 'guest') {
        await clearSession();
      } else {
        await setSessionUser(userId);
      }
      router.refresh();
    });
  }

  return (
    <div className="fixed bottom-4 end-4 z-50 flex items-center gap-2 rounded-card border border-tag-border bg-tag px-3 py-2 text-xs shadow-lg">
      <span className="font-mono uppercase tracking-wide text-ink-muted">
        {locale === 'en' ? 'Dev role' : 'دور تجريبي'}
      </span>
      <select
        value={currentUserId}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="rounded-tag border border-tag-border bg-surface px-2 py-1 text-xs text-ink"
      >
        <option value="guest">{locale === 'en' ? 'Guest (retail)' : 'زائر (قطاعي)'}</option>
        {ACCOUNTS.map((a) => (
          <option key={a.userId} value={a.userId}>
            {ROLE_LABELS[a.role][locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
