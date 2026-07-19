import { isLocale, type Locale } from '@/lib/i18n/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryListingPage } from '@/components/storefront/CategoryListingPage';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  return buildMetadata({
    locale,
    path: '/vegetables',
    title: locale === 'en' ? 'Fresh Vegetables | Qtouf' : 'خضار طازة | قطوف',
    description:
      locale === 'en'
        ? 'Browse fresh vegetables delivered across the UAE — retail and wholesale pricing.'
        : 'تصفح الخضار الطازة توصل لكل الإمارات — أسعار قطاعي وجملة.',
  });
}

export default function VegetablesPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | undefined>;
}) {
  if (!isLocale(params.locale)) notFound();
  return <CategoryListingPage locale={params.locale as Locale} type="vegetables" searchParams={searchParams} />;
}
