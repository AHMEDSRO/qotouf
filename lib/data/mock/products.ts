import type { Product } from '@/lib/types/product';

function img(nameEn: string, nameAr: string): Product['images'] {
  const encoded = encodeURIComponent(nameEn);
  // .png extension forces a raster response — placehold.co defaults to SVG, which next/image
  // blocks by default for security (dangerouslyAllowSVG).
  return [{ url: `https://placehold.co/600x400.png?text=${encoded}`, altEn: nameEn, altAr: nameAr }];
}

const now = new Date().toISOString();

interface Seed {
  slug: string;
  nameEn: string;
  nameAr: string;
  categoryId: string;
  countryOfOrigin: string;
  sizeWeight: string;
  unit: Product['unit'];
  costPrice: number;
  retailPrice: number;
  wholesalePrice: number | null;
  quantityInStock: number;
}

const seeds: Seed[] = [
  { slug: 'tomato', nameEn: 'Tomato', nameAr: 'طماطم', categoryId: 'veg-other', countryOfOrigin: 'AE', sizeWeight: '1kg', unit: 'kg', costPrice: 3.5, retailPrice: 6, wholesalePrice: 4.5, quantityInStock: 400 },
  { slug: 'cucumber', nameEn: 'Cucumber', nameAr: 'خيار', categoryId: 'veg-other', countryOfOrigin: 'AE', sizeWeight: '1kg', unit: 'kg', costPrice: 2.5, retailPrice: 5, wholesalePrice: 3.5, quantityInStock: 350 },
  { slug: 'spinach', nameEn: 'Spinach', nameAr: 'سبانخ', categoryId: 'veg-leafy', countryOfOrigin: 'EG', sizeWeight: '500g', unit: 'bunch', costPrice: 2, retailPrice: 4, wholesalePrice: 2.8, quantityInStock: 180 },
  { slug: 'lettuce', nameEn: 'Lettuce', nameAr: 'خس', categoryId: 'veg-leafy', countryOfOrigin: 'JO', sizeWeight: '400g', unit: 'piece', costPrice: 1.8, retailPrice: 3.5, wholesalePrice: 2.5, quantityInStock: 220 },
  { slug: 'arugula', nameEn: 'Arugula', nameAr: 'جرجير', categoryId: 'veg-leafy', countryOfOrigin: 'LB', sizeWeight: '250g', unit: 'bunch', costPrice: 2.2, retailPrice: 4.5, wholesalePrice: 3, quantityInStock: 120 },
  { slug: 'potato', nameEn: 'Potato', nameAr: 'بطاطس', categoryId: 'veg-roots', countryOfOrigin: 'NL', sizeWeight: '2kg', unit: 'kg', costPrice: 2, retailPrice: 4, wholesalePrice: 2.7, quantityInStock: 600 },
  { slug: 'carrot', nameEn: 'Carrot', nameAr: 'جزر', categoryId: 'veg-roots', countryOfOrigin: 'EG', sizeWeight: '1kg', unit: 'kg', costPrice: 2.3, retailPrice: 4.5, wholesalePrice: 3, quantityInStock: 300 },
  { slug: 'onion', nameEn: 'Onion', nameAr: 'بصل', categoryId: 'veg-roots', countryOfOrigin: 'IN', sizeWeight: '2kg', unit: 'kg', costPrice: 1.8, retailPrice: 3.5, wholesalePrice: 2.4, quantityInStock: 500 },
  { slug: 'beetroot', nameEn: 'Beetroot', nameAr: 'شمندر', categoryId: 'veg-roots', countryOfOrigin: 'EG', sizeWeight: '1kg', unit: 'kg', costPrice: 2.6, retailPrice: 5, wholesalePrice: 3.4, quantityInStock: 90 },
  { slug: 'bell-pepper', nameEn: 'Bell Pepper', nameAr: 'فلفل رومي', categoryId: 'veg-other', countryOfOrigin: 'ES', sizeWeight: '1kg', unit: 'kg', costPrice: 4, retailPrice: 7.5, wholesalePrice: 5.5, quantityInStock: 210 },
  { slug: 'zucchini', nameEn: 'Zucchini', nameAr: 'كوسة', categoryId: 'veg-other', countryOfOrigin: 'AE', sizeWeight: '1kg', unit: 'kg', costPrice: 2.8, retailPrice: 5.5, wholesalePrice: 3.8, quantityInStock: 260 },
  { slug: 'orange', nameEn: 'Orange', nameAr: 'برتقال', categoryId: 'fruit-citrus', countryOfOrigin: 'EG', sizeWeight: '1kg', unit: 'kg', costPrice: 3, retailPrice: 6, wholesalePrice: 4, quantityInStock: 340 },
  { slug: 'lemon', nameEn: 'Lemon', nameAr: 'ليمون', categoryId: 'fruit-citrus', countryOfOrigin: 'EG', sizeWeight: '1kg', unit: 'kg', costPrice: 3.2, retailPrice: 6.5, wholesalePrice: 4.3, quantityInStock: 260 },
  { slug: 'grapefruit', nameEn: 'Grapefruit', nameAr: 'جريب فروت', categoryId: 'fruit-citrus', countryOfOrigin: 'ZA', sizeWeight: '1kg', unit: 'kg', costPrice: 4.5, retailPrice: 8.5, wholesalePrice: 6, quantityInStock: 80 },
  { slug: 'mango', nameEn: 'Mango', nameAr: 'مانجو', categoryId: 'fruit-tropical', countryOfOrigin: 'IN', sizeWeight: '1kg', unit: 'kg', costPrice: 6, retailPrice: 11, wholesalePrice: 8, quantityInStock: 150 },
  { slug: 'banana', nameEn: 'Banana', nameAr: 'موز', categoryId: 'fruit-tropical', countryOfOrigin: 'IN', sizeWeight: '1kg', unit: 'kg', costPrice: 2.5, retailPrice: 5, wholesalePrice: 3.5, quantityInStock: 420 },
  { slug: 'pineapple', nameEn: 'Pineapple', nameAr: 'أناناس', categoryId: 'fruit-tropical', countryOfOrigin: 'PH', sizeWeight: '1 piece', unit: 'piece', costPrice: 8, retailPrice: 15, wholesalePrice: 11, quantityInStock: 60 },
  { slug: 'strawberry', nameEn: 'Strawberry', nameAr: 'فراولة', categoryId: 'fruit-berries', countryOfOrigin: 'EG', sizeWeight: '250g', unit: 'box', costPrice: 5, retailPrice: 9.5, wholesalePrice: 7, quantityInStock: 100 },
  { slug: 'blueberry', nameEn: 'Blueberry', nameAr: 'توت أزرق', categoryId: 'fruit-berries', countryOfOrigin: 'ES', sizeWeight: '125g', unit: 'box', costPrice: 9, retailPrice: 16, wholesalePrice: 12, quantityInStock: 8 },
  { slug: 'grapes', nameEn: 'Grapes', nameAr: 'عنب', categoryId: 'fruit-berries', countryOfOrigin: 'EG', sizeWeight: '500g', unit: 'box', costPrice: 5.5, retailPrice: 10, wholesalePrice: 7.5, quantityInStock: 140 },
];

export function seedProducts(): Product[] {
  return seeds.map((s) => ({
    id: s.slug,
    slug: s.slug,
    name: { en: s.nameEn, ar: s.nameAr },
    description: {
      en: `Fresh ${s.nameEn.toLowerCase()}, sourced daily.`,
      ar: `${s.nameAr} طازة، توريد يومي.`,
    },
    categoryId: s.categoryId,
    countryOfOrigin: s.countryOfOrigin,
    sizeWeight: s.sizeWeight,
    unit: s.unit,
    images: img(s.nameEn, s.nameAr),
    costPrice: s.costPrice,
    retailPrice: s.retailPrice,
    wholesalePrice: s.wholesalePrice,
    quantityInStock: s.quantityInStock,
    lowStockThreshold: 20,
    isWholesaleAvailable: s.wholesalePrice !== null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }));
}
