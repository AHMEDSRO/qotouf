import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n/config';
import type { Category } from '@/lib/types/category';

export function CategoryNav({
  locale,
  parentSlug,
  categories,
  activeSlug,
}: {
  locale: Locale;
  parentSlug: 'vegetables' | 'fruits';
  categories: Category[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <nav className="flex flex-wrap gap-2" aria-label={parentSlug}>
      <Link
        href={`/${locale}/${parentSlug}`}
        className={cn(
          'rounded-tag border px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors',
          !activeSlug
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-surface text-ink hover:border-primary/50'
        )}
      >
        {locale === 'en' ? 'All' : 'الكل'}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${locale}/${parentSlug}/${category.slug}`}
          className={cn(
            'rounded-tag border px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors',
            activeSlug === category.slug
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-surface text-ink hover:border-primary/50'
          )}
        >
          {category.name[locale]}
        </Link>
      ))}
    </nav>
  );
}
