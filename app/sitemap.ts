import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { categoryRepository, productRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ctx = getRequestContext();
  const [categories, products] = await Promise.all([categoryRepository.list(ctx), productRepository.list(ctx)]);

  const staticPaths = ['', '/vegetables', '/fruits', '/wholesale', '/search'];
  const categoryPaths = categories.filter((c) => c.parentId !== null).map((c) => `/${c.type}/${c.slug}`);
  const productPaths = products.map((p) => `/product/${p.slug}`);
  const allPaths = [...staticPaths, ...categoryPaths, ...productPaths];

  return locales.flatMap((locale) =>
    allPaths.map((path) => ({
      url: `${APP_URL}/${locale}${path}`,
      lastModified: new Date(),
    }))
  );
}
