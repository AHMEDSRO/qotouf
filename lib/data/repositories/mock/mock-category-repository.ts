import { readCollection } from '@/lib/data/store';
import { seedCategories } from '@/lib/data/mock/categories';
import type { Category } from '@/lib/types/category';
import type { CategoryRepository } from '../category-repository';

export const mockCategoryRepository: CategoryRepository = {
  async list() {
    return readCollection<Category>('categories', seedCategories);
  },
  async getBySlug(_ctx, slug) {
    const categories = readCollection<Category>('categories', seedCategories);
    return categories.find((c) => c.slug === slug) ?? null;
  },
};
