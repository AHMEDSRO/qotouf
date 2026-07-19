import type { Category } from '@/lib/types/category';

export function seedCategories(): Category[] {
  return [
    { id: 'veg', slug: 'vegetables', type: 'vegetables', name: { en: 'Vegetables', ar: 'خضار' }, parentId: null },
    { id: 'veg-leafy', slug: 'leafy-greens', type: 'vegetables', name: { en: 'Leafy Greens', ar: 'ورقيات' }, parentId: 'veg' },
    { id: 'veg-roots', slug: 'roots', type: 'vegetables', name: { en: 'Roots & Tubers', ar: 'جذور ودرنيات' }, parentId: 'veg' },
    { id: 'veg-other', slug: 'other-vegetables', type: 'vegetables', name: { en: 'Other Vegetables', ar: 'خضار أخرى' }, parentId: 'veg' },

    { id: 'fruit', slug: 'fruits', type: 'fruits', name: { en: 'Fruits', ar: 'فاكهة' }, parentId: null },
    { id: 'fruit-citrus', slug: 'citrus', type: 'fruits', name: { en: 'Citrus', ar: 'حمضيات' }, parentId: 'fruit' },
    { id: 'fruit-tropical', slug: 'tropical', type: 'fruits', name: { en: 'Tropical', ar: 'استوائية' }, parentId: 'fruit' },
    { id: 'fruit-berries', slug: 'berries', type: 'fruits', name: { en: 'Berries', ar: 'توت' }, parentId: 'fruit' },
  ];
}
