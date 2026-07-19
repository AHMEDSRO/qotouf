import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { LanguageToggle } from './LanguageToggle';
import { SearchBar } from '@/components/storefront/SearchBar';
import { CartBadge } from '@/components/cart/CartBadge';

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href={`/${locale}`} className="flex items-center rounded-card bg-surface px-3 py-1.5 shadow-sm">
          <Image src="/logo.jpg" alt={dict.brand} width={140} height={35} className="h-9 w-auto" priority />
        </Link>

        <nav className="order-3 flex w-full items-center gap-6 text-sm font-semibold uppercase tracking-wide sm:order-none sm:w-auto">
          <Link href={`/${locale}/vegetables`} className="hover:text-accent">
            {dict.nav.vegetables}
          </Link>
          <Link href={`/${locale}/fruits`} className="hover:text-accent">
            {dict.nav.fruits}
          </Link>
          <Link
            href={`/${locale}/wholesale`}
            className="rounded-tag border border-accent px-2 py-1 text-accent hover:bg-accent hover:text-accent-foreground"
          >
            {dict.nav.wholesale}
          </Link>
        </nav>

        <div className="hidden md:block">
          <SearchBar locale={locale} placeholder={dict.nav.search} />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <CartBadge locale={locale} label={dict.nav.cart} />
          <Link href={`/${locale}/account`} aria-label={dict.nav.account} className="hover:text-accent">
            <User className="h-5 w-5" />
          </Link>
          <LanguageToggle locale={locale} label={dict.common.languageToggle} />
        </div>
      </div>
    </header>
  );
}
