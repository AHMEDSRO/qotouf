import type { NewUserProfile, UserProfile } from '@/lib/types/user';
import type { RequestContext } from '@/lib/auth/auth-provider';

export interface UserRepository {
  list(ctx: RequestContext): Promise<UserProfile[]>;
  getById(ctx: RequestContext, id: string): Promise<UserProfile | null>;
  update(ctx: RequestContext, id: string, patch: Partial<UserProfile>): Promise<UserProfile>;
  /** Self-serve registration — no ctx/permission check, anyone can create their own account. */
  create(input: NewUserProfile): Promise<UserProfile>;
}
