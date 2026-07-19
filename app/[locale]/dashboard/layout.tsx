import type { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { getRequestContext } from '@/lib/auth/session';
import { isStaffRole, ROLE_LABELS } from '@/lib/rbac/roles';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Badge } from '@/components/ui/Badge';

export default function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = getRequestContext();

  if (!isStaffRole(ctx.role)) redirect(`/${locale}/account`);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">
      <div>
        <div className="mb-4 flex items-center justify-between gap-2 lg:hidden">
          <span className="font-display text-lg tracking-wide text-ink">{locale === 'en' ? 'Dashboard' : 'لوحة التحكم'}</span>
          <Badge variant="primary">{ROLE_LABELS[ctx.role][locale]}</Badge>
        </div>
        <Sidebar locale={locale} role={ctx.role} />
      </div>
      <div className="flex-1">
        <div className="mb-6 hidden items-center justify-between lg:flex">
          <h1 className="font-display text-2xl tracking-wide text-ink">{locale === 'en' ? 'Dashboard' : 'لوحة التحكم'}</h1>
          <Badge variant="primary">{ROLE_LABELS[ctx.role][locale]}</Badge>
        </div>
        {children}
      </div>
    </div>
  );
}
