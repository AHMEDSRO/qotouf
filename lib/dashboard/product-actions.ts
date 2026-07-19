'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { productRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const createProductSchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  descriptionEn: z.string().default(''),
  descriptionAr: z.string().default(''),
  categoryId: z.string().min(1),
  countryOfOrigin: z.string().min(1),
  sizeWeight: z.string().min(1),
  unit: z.enum(['kg', 'g', 'piece', 'box', 'bunch']),
  imageUrl: z.string().url(),
  costPrice: z.coerce.number().min(0),
  retailPrice: z.coerce.number().min(0),
  wholesalePrice: z.coerce.number().min(0).optional(),
  quantityInStock: z.coerce.number().min(0),
  lowStockThreshold: z.coerce.number().min(0),
});

export async function createProductAction(locale: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const data = createProductSchema.parse(raw);
  const ctx = await getRequestContext();

  await productRepository.create(ctx, {
    slug: slugify(data.nameEn),
    name: { en: data.nameEn, ar: data.nameAr },
    description: { en: data.descriptionEn, ar: data.descriptionAr },
    categoryId: data.categoryId,
    countryOfOrigin: data.countryOfOrigin,
    sizeWeight: data.sizeWeight,
    unit: data.unit,
    images: [{ url: data.imageUrl, altEn: data.nameEn, altAr: data.nameAr }],
    costPrice: data.costPrice,
    retailPrice: data.retailPrice,
    wholesalePrice: data.wholesalePrice ?? null,
    quantityInStock: data.quantityInStock,
    lowStockThreshold: data.lowStockThreshold,
    isWholesaleAvailable: Boolean(data.wholesalePrice),
    isActive: true,
  });

  revalidatePath(`/${locale}/dashboard/products`);
  redirect(`/${locale}/dashboard/products`);
}

export async function adjustStockAction(locale: string, productId: string, formData: FormData) {
  const delta = Number(formData.get('delta'));
  const ctx = await getRequestContext();
  await productRepository.adjustStock(ctx, productId, delta);
  revalidatePath(`/${locale}/dashboard/inventory`);
}
