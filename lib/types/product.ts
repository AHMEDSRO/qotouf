import type { LocalizedText } from './common';

export type ProductUnit = 'kg' | 'g' | 'piece' | 'box' | 'bunch';

export interface ProductImage {
  url: string;
  altEn: string;
  altAr: string;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  countryOfOrigin: string; // ISO 3166-1 alpha-2
  sizeWeight: string; // e.g. "1kg", "500g"
  unit: ProductUnit;
  images: ProductImage[];
  /** Cost price — dashboard-only, gated behind the 'view_cost_price' permission. */
  costPrice: number;
  /** AED, VAT-exclusive. */
  retailPrice: number;
  /** AED, VAT-exclusive. null = not offered wholesale. */
  wholesalePrice: number | null;
  quantityInStock: number;
  lowStockThreshold: number;
  isWholesaleAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Product shape safe to expose to callers without 'view_cost_price'. */
export type PublicProduct = Omit<Product, 'costPrice'>;
