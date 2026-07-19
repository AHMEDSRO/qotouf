import { cookies } from 'next/headers';
import { readCollection } from '@/lib/data/store';
import { seedUsers } from '@/lib/data/mock/users';
import type { UserProfile } from '@/lib/types/user';
import type { AuthProvider, RequestContext } from './auth-provider';
import { SESSION_COOKIE, GUEST_USER_ID } from './constants';

function loadUsers(): UserProfile[] {
  return readCollection<UserProfile>('users', seedUsers);
}

/**
 * Resolves the current mock session from the RoleSwitcher's cookie. Falls
 * back to a guest/retail context when no cookie is set (first visit).
 */
export function getRequestContext(): RequestContext {
  const userId = cookies().get(SESSION_COOKIE)?.value ?? GUEST_USER_ID;
  if (userId === GUEST_USER_ID) {
    return { userId: GUEST_USER_ID, role: 'retail_customer' };
  }
  const user = loadUsers().find((u) => u.id === userId);
  if (!user) return { userId: GUEST_USER_ID, role: 'retail_customer' };
  return { userId: user.id, role: user.role };
}

export function getCurrentUser(): UserProfile | null {
  const ctx = getRequestContext();
  if (ctx.userId === GUEST_USER_ID) return null;
  return loadUsers().find((u) => u.id === ctx.userId) ?? null;
}

export const mockAuthProvider: AuthProvider = { getRequestContext, getCurrentUser };
