import * as XLSX from 'xlsx';
import { z } from 'zod';
import type { Product } from '@/lib/types/product';
import type { Category } from '@/lib/types/category';

export const IMPORT_COLUMNS = [
  'Name (EN)',
  'Name (AR)',
  'Category Slug',
  'Country of Origin',
  'Size/Weight',
  'Unit',
  'Retail Price',
  'Wholesale Price',
  'Quantity',
  'Image URL',
] as const;

const rowSchema = z.object({
  'Name (EN)': z.string().min(1, 'Name (EN) is required'),
  'Name (AR)': z.string().min(1, 'Name (AR) is required'),
  'Category Slug': z.string().min(1, 'Category Slug is required'),
  'Country of Origin': z.string().min(1, 'Country of Origin is required'),
  'Size/Weight': z.string().min(1, 'Size/Weight is required'),
  Unit: z.enum(['kg', 'g', 'piece', 'box', 'bunch'], { errorMap: () => ({ message: 'Unit must be kg, g, piece, box, or bunch' }) }),
  'Retail Price': z.coerce.number().min(0, 'Retail Price must be >= 0'),
  'Wholesale Price': z.union([z.coerce.number().min(0), z.literal('')]).optional(),
  Quantity: z.coerce.number().min(0, 'Quantity must be >= 0'),
  'Image URL': z.string().url('Image URL must be a valid URL'),
});

export interface ImportRowError {
  row: number;
  message: string;
}

export type NewProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface ParseResult {
  valid: NewProduct[];
  errors: ImportRowError[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Parses an uploaded workbook, validating each row independently (partial import: bad rows are skipped and reported, good rows still import). */
export function parseProductWorkbook(buffer: ArrayBuffer, categories: Category[]): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  const valid: NewProduct[] = [];
  const errors: ImportRowError[] = [];

  rows.forEach((raw, index) => {
    const rowNumber = index + 2; // header is row 1
    const result = rowSchema.safeParse(raw);
    if (!result.success) {
      errors.push({ row: rowNumber, message: result.error.issues.map((i) => i.message).join('; ') });
      return;
    }
    const data = result.data;

    const category = categories.find((c) => c.slug === data['Category Slug']);
    if (!category) {
      errors.push({ row: rowNumber, message: `Unknown category slug: ${data['Category Slug']}` });
      return;
    }

    const wholesalePrice =
      data['Wholesale Price'] === '' || data['Wholesale Price'] === undefined ? null : Number(data['Wholesale Price']);

    valid.push({
      slug: slugify(data['Name (EN)']),
      name: { en: data['Name (EN)'], ar: data['Name (AR)'] },
      description: { en: '', ar: '' },
      categoryId: category.id,
      countryOfOrigin: data['Country of Origin'].toUpperCase(),
      sizeWeight: data['Size/Weight'],
      unit: data.Unit,
      images: [{ url: data['Image URL'], altEn: data['Name (EN)'], altAr: data['Name (AR)'] }],
      costPrice: 0,
      retailPrice: data['Retail Price'],
      wholesalePrice,
      quantityInStock: data.Quantity,
      lowStockThreshold: 20,
      isWholesaleAvailable: wholesalePrice !== null,
      isActive: true,
    });
  });

  return { valid, errors };
}

export function buildTemplateWorkbook(): XLSX.WorkBook {
  const sample = {
    'Name (EN)': 'Tomato',
    'Name (AR)': 'طماطم',
    'Category Slug': 'other-vegetables',
    'Country of Origin': 'AE',
    'Size/Weight': '1kg',
    Unit: 'kg',
    'Retail Price': 6,
    'Wholesale Price': 4.5,
    Quantity: 100,
    'Image URL': 'https://placehold.co/600x400.png',
  };
  const sheet = XLSX.utils.json_to_sheet([sample], { header: [...IMPORT_COLUMNS] });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Products');
  return workbook;
}
