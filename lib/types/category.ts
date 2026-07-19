import type { LocalizedText } from './common';

export type CategoryType = 'vegetables' | 'fruits';

export interface Category {
  id: string;
  slug: string;
  type: CategoryType;
  name: LocalizedText;
  parentId: string | null;
  imageUrl?: string;
}
