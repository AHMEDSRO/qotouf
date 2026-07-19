import { readCollection } from '@/lib/data/store';
import { seedDeliveryRegions } from '@/lib/data/mock/delivery-regions';
import type { DeliveryRegion } from '@/lib/types/delivery';
import type { DeliveryRepository } from '../delivery-repository';

export const mockDeliveryRepository: DeliveryRepository = {
  async list() {
    return readCollection<DeliveryRegion>('delivery-regions', seedDeliveryRegions);
  },
  async getById(_ctx, id) {
    const regions = readCollection<DeliveryRegion>('delivery-regions', seedDeliveryRegions);
    return regions.find((r) => r.id === id) ?? null;
  },
};
