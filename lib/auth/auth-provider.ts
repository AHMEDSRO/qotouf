import type { Role } from '@/lib/rbac/roles';
import type { UserProfile } from '@/lib/types/user';

export interface RequestContext {
  userId: string;
  role: Role;
}

/**
 * Abstraction over "who is making this request" — the mock (cookie-based)
 * implementation lives in session.ts. When real Supabase Auth ships, a
 * SupabaseAuthProvider implementing this same interface replaces it with no
 * changes needed in pages/components that only depend on RequestContext.
 */
export interface AuthProvider {
  getRequestContext(): RequestContext;
  getCurrentUser(): UserProfile | null;
}
