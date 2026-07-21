import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { PlatformSettings } from '@/lib/types/settings';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
    </svg>
  );
}

export function Footer({
  locale,
  dict,
  socialLinks,
}: {
  locale: Locale;
  dict: Dictionary;
  socialLinks: Pick<PlatformSettings, 'instagramUrl' | 'facebookUrl' | 'tiktokUrl' | 'twitterUrl'>;
}) {
  const social = [
    { href: socialLinks.instagramUrl, label: 'Instagram', Icon: Instagram },
    { href: socialLinks.facebookUrl, label: 'Facebook', Icon: Facebook },
    { href: socialLinks.tiktokUrl, label: 'TikTok', Icon: TikTokIcon },
    { href: socialLinks.twitterUrl, label: 'X (Twitter)', Icon: Twitter },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt={dict.brand} width={936} height={458} className="h-10 w-auto" />
          <p className="font-mono text-xs">
            © {new Date().getFullYear()} — {dict.footer.rights}
          </p>
        </div>

        <nav className="flex flex-wrap gap-4">
          <Link href={`/${locale}/policies/delivery`} className="hover:text-primary">{dict.footer.deliveryPolicy}</Link>
          <Link href={`/${locale}/policies/returns`} className="hover:text-primary">{dict.footer.returnPolicy}</Link>
          <Link href={`/${locale}/policies/terms`} className="hover:text-primary">{dict.footer.terms}</Link>
          <Link href={`/${locale}/policies/privacy`} className="hover:text-primary">{dict.footer.privacy}</Link>
        </nav>

        {social.length > 0 && (
          <div className="flex items-center gap-3">
            {social.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-ink-muted transition-colors hover:text-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
