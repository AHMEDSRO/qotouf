'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { AppNotification } from '@/lib/types/notification';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { cn } from '@/lib/utils';

interface NotificationRow {
  id: string;
  recipient_user_id: string;
  title: string;
  body: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

function toNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    recipientUserId: row.recipient_user_id,
    title: row.title,
    body: row.body,
    link: row.link,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

export function NotificationBell({ userId, locale }: { userId: string; locale: Locale }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    async function init() {
      // @supabase/ssr's browser client resolves the session from cookies
      // asynchronously — the Realtime WebSocket needs that access token handed
      // to it explicitly, otherwise it can authenticate before the session is
      // ready and silently never receive RLS-protected postgres_changes events.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) supabase.realtime.setAuth(session.access_token);

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (cancelled) return;
      if (data) setNotifications((data as NotificationRow[]).map(toNotification));

      // A unique topic per effect run avoids a Supabase Realtime client quirk where
      // React Strict Mode's mount→cleanup→mount in dev reuses a still-subscribed
      // channel instance for the same topic name, throwing on the second `.on()`.
      channel = supabase
        .channel(`notifications:${userId}:${Math.random().toString(36).slice(2)}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_user_id=eq.${userId}` },
          (payload: { new: NotificationRow }) => {
            setNotifications((prev) => [toNotification(payload.new), ...prev].slice(0, 20));
          }
        )
        .subscribe();
    }

    init();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function handleOpen() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (!nextOpen) return;

    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifications((prev) => prev.map((n) => (unreadIds.includes(n.id) ? { ...n, isRead: true } : n)));
    const supabase = getSupabaseBrowserClient();
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label={locale === 'en' ? 'Notifications' : 'الإشعارات'}
        className="relative rounded-tag p-2 text-ink-muted hover:bg-surface-muted hover:text-ink"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute end-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- invisible backdrop for click-outside-to-close, not itself an interactive control */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-full z-20 mt-2 w-80 rounded-card border border-border bg-surface shadow-lg">
            <div className="border-b border-border px-4 py-2 text-sm font-semibold text-ink">
              {locale === 'en' ? 'Notifications' : 'الإشعارات'}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-ink-muted">
                  {locale === 'en' ? 'No notifications yet.' : 'لا يوجد إشعارات بعد.'}
                </p>
              ) : (
                notifications.map((n) => {
                  const content = (
                    <>
                      <p className="text-sm font-semibold text-ink">{n.title}</p>
                      <p className="text-xs text-ink-muted">{n.body}</p>
                      <p className="mt-1 font-mono text-[10px] text-ink-muted">{new Date(n.createdAt).toLocaleString(locale)}</p>
                    </>
                  );
                  return n.link ? (
                    <Link
                      key={n.id}
                      href={`/${locale}${n.link}`}
                      onClick={() => setOpen(false)}
                      className={cn('block border-b border-border px-4 py-3 last:border-0 hover:bg-surface-muted', !n.isRead && 'bg-primary/5')}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={n.id} className={cn('border-b border-border px-4 py-3 last:border-0', !n.isRead && 'bg-primary/5')}>
                      {content}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
