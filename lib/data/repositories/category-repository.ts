import type { Category } from '@/lib/types/category';
import type { RequestContext } from '@/lib/auth/auth-provider';

export interface CategoryRepository {
  list(ctx: RequestContext): Promise<Category[]>;
  getBySlug(ctx: RequestContext, slug: string): Promise<Category | null>;
}
