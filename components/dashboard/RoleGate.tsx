import type { ReactNode } from 'react';
import type { Role } from '@/lib/rbac/roles';
import { can, type Action } from '@/lib/rbac/permissions';

/** Hides dashboard UI the current role can't act on — mirrors the repository-layer checks for defense-in-depth. */
export function RoleGate({
  role,
  action,
  children,
  fallback = null,
}: {
  role: Role;
  action: Action;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  if (!can(role, action)) return <>{fallback}</>;
  return <>{children}</>;
}
