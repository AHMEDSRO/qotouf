import type { NewUserProfile, UserProfile, UserProfilePatch } from '@/lib/types/user';
import type { RequestContext } from '@/lib/auth/auth-provider';

export interface UserRepository {
  list(ctx: RequestContext): Promise<UserProfile[]>;
  getById(ctx: RequestContext, id: string): Promise<UserProfile | null>;
  /** Resolves the app profile for a Supabase Auth session — used by getRequestContext(). */
  getByAuthId(authUserId: string): Promise<UserProfile | null>;
  update(ctx: RequestContext, id: string, patch: UserProfilePatch): Promise<UserProfile>;
  /** Self-serve registration — no ctx/permission check, anyone can create their own account. */
  create(input: NewUserProfile, authUserId?: string): Promise<UserProfile>;
}
