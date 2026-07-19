import type { Emirate, LocalizedText } from './common';

export interface DeliveryRegion {
  id: string;
  emirate: Emirate;
  area: string;
  name: LocalizedText;
  deliveryFee: number;
  isActive: boolean;
}
