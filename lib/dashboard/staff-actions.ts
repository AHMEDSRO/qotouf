'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin-client';
import { userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { assertCan } from '@/lib/rbac/permissions';
import { STAFF_ROLES, type StaffRole } from '@/lib/rbac/roles';

const inviteSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  role: z.enum(STAFF_ROLES as [StaffRole, ...StaffRole[]]),
});

/**
 * Super Admin invites a new staff account — Supabase sends its own invite email with a
 * link for them to set their own password; we never see or set it ourselves.
 */
export async function inviteStaffAction(locale: string, formData: FormData) {
  const ctx = await getRequestContext();
  assertCan(ctx.role, 'edit_role_permissions');

  const data = inviteSchema.parse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    role: formData.get('role'),
  });

  const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email);
  if (error) throw new Error(error.message);
  if (!invited.user) throw new Error('Invite failed');

  await userRepository.create(
    {
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      locale: 'en',
    },
    invited.user.id
  );

  revalidatePath(`/${locale}/dashboard/settings/users`);
}
