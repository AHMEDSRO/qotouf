import Link from 'next/link';
import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { getRequestContext } from '@/lib/auth/session';
import { can } from '@/lib/rbac/permissions';
import { Card } from '@/components/ui/Card';

export default async function SettingsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();

  const links = [
    {
      href: `/${locale}/dashboard/settings/payments`,
      titleEn: 'Payments',
      titleAr: 'المدفوعات',
      descEn: 'Stripe keys and payment configuration.',
      descAr: 'مفاتيح Stripe وإعدادات الدفع.',
      visible: can(ctx.role, 'manage_payment_settings'),
    },
    {
      href: `/${locale}/dashboard/settings/users`,
      titleEn: 'Users & roles',
      titleAr: 'المستخدمين والصلاحيات',
      descEn: 'Assign roles to staff accounts.',
      descAr: 'تحديد أدوار الموظفين.',
      visible: can(ctx.role, 'edit_role_permissions'),
    },
  ].filter((l) => l.visible);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'Settings' : 'الإعدادات'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="p-4 transition-colors hover:border-primary/50">
              <p className="font-semibold text-ink">{locale === 'en' ? link.titleEn : link.titleAr}</p>
              <p className="mt-1 text-sm text-ink-muted">{locale === 'en' ? link.descEn : link.descAr}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
