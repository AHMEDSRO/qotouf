import { readCollection, writeCollection } from '@/lib/data/store';
import { seedOrders } from '@/lib/data/mock/orders';
import type { Order, OrderStatus } from '@/lib/types/order';
import { assertCan, can } from '@/lib/rbac/permissions';
import { assertCanTransition } from '@/lib/orders/order-status';
import { notifier } from '@/lib/notifications/notifier';
import type { OrderRepository } from '../order-repository';

function loadAll(): Order[] {
  return readCollection<Order>('orders', seedOrders);
}

function nextOrderNumber(orders: Order[]): string {
  const max = orders.reduce((acc, o) => {
    const n = Number(o.orderNumber.replace('QT-', ''));
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 1000);
  return `QT-${max + 1}`;
}

export const mockOrderRepository: OrderRepository = {
  async list(ctx) {
    const orders = loadAll();
    if (can(ctx.role, 'view_all_orders')) return orders;
    if (can(ctx.role, 'view_own_orders')) return orders.filter((o) => o.customerId === ctx.userId);
    throw new Error('Role lacks permission to view orders');
  },

  async getById(ctx, id) {
    const order = loadAll().find((o) => o.id === id);
    if (!order) return null;
    const isOwner = order.customerId === ctx.userId;
    if (!isOwner && !can(ctx.role, 'view_all_orders')) {
      throw new Error('Role lacks permission to view this order');
    }
    return order;
  },

  async create(ctx, input) {
    const isSelfCheckout = input.customerId === ctx.userId;
    if (!isSelfCheckout) {
      assertCan(ctx.role, 'create_wholesale_order');
    }
    const orders = loadAll();
    const now = new Date().toISOString();
    const order: Order = {
      ...input,
      id: `order-${Date.now()}`,
      orderNumber: nextOrderNumber(orders),
      statusHistory: [{ status: input.status, at: now, byUserId: ctx.userId }],
      createdAt: now,
      updatedAt: now,
    };
    writeCollection('orders', [...orders, order]);
    await notifier.notify({ type: 'order_created', orderId: order.id, orderNumber: order.orderNumber, customerId: order.customerId });
    return order;
  },

  async updateStatus(ctx, id, status) {
    assertCan(ctx.role, 'update_order_status');
    const orders = loadAll();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order not found: ${id}`);
    const current = orders[index];
    assertCanTransition(current.status, status);
    const updated: Order = {
      ...current,
      status,
      statusHistory: [...current.statusHistory, { status, at: new Date().toISOString(), byUserId: ctx.userId }],
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updated;
    writeCollection('orders', orders);
    await notifier.notify({ type: 'order_status_changed', orderId: updated.id, orderNumber: updated.orderNumber, status });
    return updated;
  },
};
