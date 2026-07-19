import type { Order, OrderStatus } from '@/lib/types/order';
import type { RequestContext } from '@/lib/auth/auth-provider';

export interface OrderRepository {
  list(ctx: RequestContext): Promise<Order[]>;
  getById(ctx: RequestContext, id: string): Promise<Order | null>;
  create(ctx: RequestContext, input: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Order>;
  updateStatus(ctx: RequestContext, id: string, status: OrderStatus): Promise<Order>;
}
