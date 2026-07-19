'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import { swapLocaleInPath } from '@/lib/i18n/config';

export function LanguageToggle({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? '/';
  const target: Locale = locale === 'ar' ? 'en' : 'ar';
  const href = swapLocaleInPath(pathname, target);

  return (
    <Link href={href} className="text-sm font-semibold hover:text-accent">
      {label}
    </Link>
  );
}
