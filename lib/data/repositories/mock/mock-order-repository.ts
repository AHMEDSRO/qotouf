import { readCollection, writeCollection } from '@/lib/data/store';
import { seedOrders } from '@/lib/data/mock/orders';
import { seedUsers } from '@/lib/data/mock/users';
import type { Order, OrderStatus } from '@/lib/types/order';
import type { UserProfile } from '@/lib/types/user';
import { assertCan, can } from '@/lib/rbac/permissions';
import { assertCanTransition } from '@/lib/orders/order-status';
import { notifier } from '@/lib/notifications/notifier';
import type { OrderRepository } from '../order-repository';

function loadAll(): Order[] {
  return readCollection<Order>('orders', seedOrders);
}

/** Keeps a wholesale customer's outstanding balance accurate as invoice-credit orders are placed and later paid off. No-op for non-wholesale customers. */
function adjustCreditBalance(customerId: string, delta: number): void {
  const users = readCollection<UserProfile>('users', seedUsers);
  const index = users.findIndex((u) => u.id === customerId);
  if (index === -1) return;
  const user = users[index];
  if (user.role !== 'wholesale_customer') return;

  const currentBalance = Math.max(0, user.creditLimit.currentBalance + delta);
  const availableCredit = Math.max(0, user.creditLimit.limit - currentBalance);
  users[index] = { ...user, creditLimit: { ...user.creditLimit, currentBalance, availableCredit } };
  writeCollection('users', users);
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
    if (order.paymentMethod === 'invoice_credit') {
      adjustCreditBalance(order.customerId, order.totals.total);
    }
    await notifier.notify({
      type: 'order_created',
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      salesRepId: order.salesRepId,
    });
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

  async confirmPayment(ctx, id) {
    assertCan(ctx.role, 'confirm_payments');
    const orders = loadAll();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order not found: ${id}`);
    const existing = orders[index];
    if (existing.paymentStatus === 'paid') return existing;

    const updated: Order = { ...existing, paymentStatus: 'paid', updatedAt: new Date().toISOString() };
    orders[index] = updated;
    writeCollection('orders', orders);

    if (updated.paymentMethod === 'invoice_credit') {
      adjustCreditBalance(updated.customerId, -updated.totals.total);
    }
    return updated;
  },
};
