import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { settingsRepository } from '@/lib/data';
import { updatePlatformSettingsAction } from '@/lib/dashboard/settings-actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function PaymentsSettingsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  requirePermission(ctx, 'manage_payment_settings', `/${locale}/dashboard`);

  const settings = await settingsRepository.get();
  const action = updatePlatformSettingsAction.bind(null, locale);

  return (
    <div className="max-w-lg space-y-6">
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

      <div className="border-t border-border pt-6">
        <h3 className="font-display text-lg tracking-wide text-ink">{locale === 'en' ? 'Contact & bank details' : 'بيانات التواصل والبنك'}</h3>
        <p className="mt-1 text-sm text-ink-muted">
          {locale === 'en'
            ? 'Shown on the WhatsApp button, invoices, and wholesale bank-transfer instructions.'
            : 'بتظهر في زرار الواتساب والفواتير وتعليمات التحويل البنكي للجملة.'}
        </p>

        <form action={action} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'WhatsApp number' : 'رقم الواتساب'}</span>
            <Input name="whatsappNumber" placeholder="971500000000" defaultValue={settings.whatsappNumber ?? ''} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink">
              {locale === 'en' ? 'Invoice contact emails (comma-separated)' : 'إيميلات التواصل على الفاتورة (مفصولة بفاصلة)'}
            </span>
            <Input name="invoiceEmails" placeholder="orders@qutoof.ae, accounts@qutoof.ae" defaultValue={settings.invoiceEmails.join(', ')} />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Bank name' : 'اسم البنك'}</span>
              <Input name="bankName" defaultValue={settings.bankName ?? ''} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Account name' : 'اسم صاحب الحساب'}</span>
              <Input name="bankAccountName" defaultValue={settings.bankAccountName ?? ''} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink">{locale === 'en' ? 'Account number' : 'رقم الحساب'}</span>
              <Input name="bankAccountNumber" defaultValue={settings.bankAccountNumber ?? ''} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-ink">IBAN</span>
              <Input name="bankIban" defaultValue={settings.bankIban ?? ''} />
            </label>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-ink">{locale === 'en' ? 'Social media' : 'السوشيال ميديا'}</h4>
            <p className="mt-1 text-xs text-ink-muted">
              {locale === 'en' ? 'Shown as icons in the footer — leave blank to hide.' : 'بتظهر كأيقونات في الفوتر — سيبها فاضية عشان تختفي.'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-ink">Instagram</span>
                <Input name="instagramUrl" type="url" placeholder="https://instagram.com/qutoof" defaultValue={settings.instagramUrl ?? ''} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-ink">Facebook</span>
                <Input name="facebookUrl" type="url" placeholder="https://facebook.com/qutoof" defaultValue={settings.facebookUrl ?? ''} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-ink">TikTok</span>
                <Input name="tiktokUrl" type="url" placeholder="https://tiktok.com/@qutoof" defaultValue={settings.tiktokUrl ?? ''} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-ink">X (Twitter)</span>
                <Input name="twitterUrl" type="url" placeholder="https://x.com/qutoof" defaultValue={settings.twitterUrl ?? ''} />
              </label>
            </div>
          </div>

          <Button type="submit" variant="accent">
            {locale === 'en' ? 'Save' : 'حفظ'}
          </Button>
        </form>
      </div>
    </div>
  );
}
