import type { ProductUnit } from '@/lib/types/product';
import type { LocalizedText } from '@/lib/types/common';

export const UNIT_LABELS: Record<ProductUnit, LocalizedText> = {
  kg: { en: 'kg', ar: 'كجم' },
  g: { en: 'g', ar: 'جم' },
  piece: { en: 'piece', ar: 'حبة' },
  box: { en: 'box', ar: 'علبة' },
  bunch: { en: 'bunch', ar: 'ربطة' },
};
