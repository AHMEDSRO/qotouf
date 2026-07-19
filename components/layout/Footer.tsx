import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt={dict.brand} width={112} height={28} className="h-7 w-auto" />
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
      </div>
    </footer>
  );
}
