import type { Role } from '@/lib/rbac/roles';
import type { UserProfile } from '@/lib/types/user';

export interface RequestContext {
  userId: string;
  role: Role;
}

/**
 * Abstraction over "who is making this request" — backed by real Supabase Auth
 * (lib/auth/session.ts). Both methods are async because resolving the session
 * requires a round-trip to Supabase Auth.
 */
export interface AuthProvider {
  getRequestContext(): Promise<RequestContext>;
  getCurrentUser(): Promise<UserProfile | null>;
}

/** Fallback context for anonymous visitors — same shape retail browsing always used. */
export const GUEST_CONTEXT: RequestContext = { userId: 'guest', role: 'retail_customer' };
