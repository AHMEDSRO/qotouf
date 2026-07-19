import { redirect } from 'next/navigation';
import type { RequestContext } from '@/lib/auth/auth-provider';
import { can, type Action } from './permissions';

export function requirePermission(ctx: RequestContext, action: Action, redirectTo: string): void {
  if (!can(ctx.role, action)) redirect(redirectTo);
}
