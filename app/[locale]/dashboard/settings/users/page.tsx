import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { ROLE_LABELS, STAFF_ROLES, isStaffRole } from '@/lib/rbac/roles';
import { updateUserRoleAction } from '@/lib/dashboard/user-actions';
import { inviteStaffAction } from '@/lib/dashboard/staff-actions';
import { DataTable } from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default async function UsersSettingsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = await getRequestContext();
  requirePermission(ctx, 'edit_role_permissions', `/${locale}/dashboard`);

  const users = await userRepository.list(ctx);
  const staff = users.filter((u) => isStaffRole(u.role));

  const inviteAction = inviteStaffAction.bind(null, locale);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'Users & roles' : 'المستخدمين والصلاحيات'}</h2>

      <form action={inviteAction} className="flex flex-wrap items-end gap-3 rounded-card border border-border bg-surface p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink-muted">{locale === 'en' ? 'Full name' : 'الاسم'}</span>
          <Input name="fullName" required className="w-40" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink-muted">{locale === 'en' ? 'Email' : 'الإيميل'}</span>
          <Input name="email" type="email" required className="w-56" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink-muted">{locale === 'en' ? 'Role' : 'الدور'}</span>
          <select name="role" required className="h-10 rounded-card border border-border bg-surface px-3 text-sm text-ink">
            {STAFF_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r][locale]}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="accent">
          {locale === 'en' ? 'Send invite' : 'ابعت دعوة'}
        </Button>
      </form>

      <DataTable
        rowKey={(u) => u.id}
        emptyMessage={locale === 'en' ? 'No staff accounts.' : 'لا يوجد حسابات موظفين.'}
        rows={staff}
        columns={[
          { header: locale === 'en' ? 'Name' : 'الاسم', render: (u) => u.fullName },
          { header: locale === 'en' ? 'Email' : 'الإيميل', render: (u) => u.email },
          {
            header: locale === 'en' ? 'Role' : 'الدور',
            render: (u) => {
              const action = updateUserRoleAction.bind(null, locale, u.id);
              return (
                <form action={action} className="flex items-center gap-2">
                  <select
                    name="role"
                    defaultValue={u.role}
                    disabled={u.id === ctx.userId}
                    className="h-9 rounded-tag border border-border bg-surface px-2 text-sm text-ink"
                  >
                    {STAFF_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r][locale]}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" size="sm" variant="outline" disabled={u.id === ctx.userId}>
                    {locale === 'en' ? 'Save' : 'حفظ'}
                  </Button>
                </form>
              );
            },
          },
        ]}
      />
    </div>
  );
}
