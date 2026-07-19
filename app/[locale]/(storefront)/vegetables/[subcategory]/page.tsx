import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryListingPage } from '@/components/storefront/CategoryListingPage';
import { buildMetadata } from '@/lib/seo/metadata';
import { categoryRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

interface Props {
  params: { locale: string; subcategory: string };
  searchParams: Record<string, string | undefined>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  const ctx = getRequestContext();
  const categories = await categoryRepository.list(ctx);
  const category = categories.find((c) => c.slug === params.subcategory && c.type === 'vegetables');
  if (!category) return {};

  return buildMetadata({
    locale,
    path: `/vegetables/${category.slug}`,
    title: `${category.name[locale]} | Qtouf`,
    description:
      locale === 'en'
        ? `Fresh ${category.name.en.toLowerCase()} delivered across the UAE.`
        : `${category.name.ar} طازة توصل لكل الإمارات.`,
  });
}

export default function VegetablesSubcategoryPage({ params, searchParams }: Props) {
  if (!isLocale(params.locale)) notFound();
  return (
    <CategoryListingPage
      locale={params.locale as Locale}
      type="vegetables"
      activeSubcategorySlug={params.subcategory}
      searchParams={searchParams}
    />
  );
}
