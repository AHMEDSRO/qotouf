import { supabaseAdmin } from '@/lib/supabase/admin-client';
import type { Role } from '@/lib/rbac/roles';

/** Resolves recipient user ids for a set of staff roles — used to fan out order/stock alerts. */
export async function staffRecipientIds(roles: Role[]): Promise<string[]> {
  const { data, error } = await supabaseAdmin.from('users').select('id').in('role', roles);
  if (error) throw error;
  return (data ?? []).map((u) => u.id as string);
}

export async function notifyUsers(recipientUserIds: string[], title: string, body: string, link?: string): Promise<void> {
  const unique = [...new Set(recipientUserIds)];
  if (unique.length === 0) return;
  const rows = unique.map((id) => ({ recipient_user_id: id, title, body, link: link ?? null }));
  const { error } = await supabaseAdmin.from('notifications').insert(rows);
  if (error) throw error;
}
