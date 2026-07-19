import type { DeliveryRegion } from '@/lib/types/delivery';
import type { RequestContext } from '@/lib/auth/auth-provider';

export interface DeliveryRepository {
  list(ctx: RequestContext): Promise<DeliveryRegion[]>;
  getById(ctx: RequestContext, id: string): Promise<DeliveryRegion | null>;
}
