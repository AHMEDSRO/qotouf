import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { userRepository } from '@/lib/data';
import type { UserProfile } from '@/lib/types/user';
import type { AuthProvider, RequestContext } from './auth-provider';
import { GUEST_CONTEXT } from './auth-provider';

/** Resolves the current Supabase Auth session, falling back to a guest/retail context when signed out. */
export async function getRequestContext(): Promise<RequestContext> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return GUEST_CONTEXT;

  const profile = await userRepository.getByAuthId(user.id);
  if (!profile) return GUEST_CONTEXT;

  return { userId: profile.id, role: profile.role };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return userRepository.getByAuthId(user.id);
}

export const authProvider: AuthProvider = { getRequestContext, getCurrentUser };
