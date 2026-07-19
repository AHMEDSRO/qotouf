import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import { userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { requirePermission } from '@/lib/rbac/guard';
import { ROLE_LABELS, STAFF_ROLES } from '@/lib/rbac/roles';
import { updateUserRoleAction } from '@/lib/dashboard/user-actions';
import { DataTable } from '@/components/dashboard/DataTable';
import { Button } from '@/components/ui/Button';

export default async function UsersSettingsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const ctx = getRequestContext();
  requirePermission(ctx, 'edit_role_permissions', `/${locale}/dashboard`);

  const users = await userRepository.list(ctx);
  const staff = users.filter((u) => STAFF_ROLES.includes(u.role));

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl tracking-wide text-ink">{locale === 'en' ? 'Users & roles' : 'المستخدمين والصلاحيات'}</h2>

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
