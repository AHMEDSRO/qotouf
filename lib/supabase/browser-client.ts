'use client';

import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser-side Supabase client (singleton) — session/auth, plus the one deliberate
 * exception to "data access always goes through the service-role client": reading
 * and marking-read the current user's own `notifications` rows, scoped by RLS,
 * because Supabase Realtime subscriptions must run under the caller's own session.
 */
export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  }
  return client;
}
