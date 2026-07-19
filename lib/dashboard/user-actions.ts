'use server';

import { revalidatePath } from 'next/cache';
import { userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import type { Role } from '@/lib/rbac/roles';

export async function updateUserRoleAction(locale: string, userId: string, formData: FormData) {
  const role = formData.get('role') as Role;
  const ctx = await getRequestContext();
  await userRepository.update(ctx, userId, { role });
  revalidatePath(`/${locale}/dashboard/settings/users`);
}
