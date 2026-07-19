import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function PaymentsSettingsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = getRequestContext();
  requirePermission(ctx, 'manage_payment_settings', `/${locale}/dashboard`);

  return (
    <div className="max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'Payments' : 'المدفوعات'}</h2>
        <Badge variant="accent">{locale === 'en' ? 'Pending trade license' : 'بانتظار الرخصة التجارية'}</Badge>
      </div>

      <Card className="p-4 text-sm text-ink-muted">
        {locale === 'en'
          ? 'Stripe activation for a UAE account requires a valid trade license, MOA, bank statement, and owner ID. Once that documentation is ready, paste the keys below and card payments go live — no code changes needed.'
          : 'تفعيل Stripe لحساب إماراتي محتاج رخصة تجارية سارية وعقد تأسيس وكشف حساب بنكي وهوية المالك. لما المستندات دي تكون جاهزة، الصق المفاتيح تحت وهيشتغل الدفع بالكارت — من غير أي تعديل كود.'}
      </Card>

      <div className="space-y-3 opacity-60">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Publishable key</span>
          <Input disabled placeholder="pk_live_…" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Secret key</span>
          <Input disabled type="password" placeholder="sk_live_…" />
        </label>
      </div>
    </div>
  );
}
