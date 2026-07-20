import type { Order, OrderStatus } from '@/lib/types/order';
import { ORDER_STATUS_LABELS } from '@/lib/types/order';
import type { Product } from '@/lib/types/product';
import type { UserProfile } from '@/lib/types/user';
import type { DeliveryRegion } from '@/lib/types/delivery';
import { round2 } from '@/lib/pricing/vat';

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function lastNMonths(n: number): { key: string; date: Date }[] {
  const result: { key: string; date: Date }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ key: monthKey(d), date: d });
  }
  return result;
}

export interface TopProductRow {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export function topProductsByRevenue(orders: Order[], locale: 'en' | 'ar', limit = 5): TopProductRow[] {
  const byProduct = new Map<string, TopProductRow>();
  for (const order of orders) {
    for (const item of order.items) {
      const existing = byProduct.get(item.productId);
      if (existing) {
        existing.quantitySold += item.quantity;
        existing.revenue = round2(existing.revenue + item.lineTotal);
      } else {
        byProduct.set(item.productId, {
          productId: item.productId,
          name: item.nameSnapshot[locale],
          quantitySold: item.quantity,
          revenue: item.lineTotal,
        });
      }
    }
  }
  return [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

export interface MarginRow {
  productId: string;
  name: string;
  margin: number;
  marginPercent: number;
}

export function marginByProduct(products: Product[], locale: 'en' | 'ar'): MarginRow[] {
  return products
    .map((p) => {
      const margin = round2(p.price - p.costPrice);
      return {
        productId: p.id,
        name: p.name[locale],
        margin,
        marginPercent: p.price > 0 ? round2((margin / p.price) * 100) : 0,
      };
    })
    .sort((a, b) => b.marginPercent - a.marginPercent);
}

export interface RepPerformanceRow {
  repId: string;
  name: string;
  orderCount: number;
  revenue: number;
}

export function repPerformance(orders: Order[], users: UserProfile[]): RepPerformanceRow[] {
  const byRep = new Map<string, RepPerformanceRow>();
  for (const order of orders) {
    if (!order.salesRepId) continue;
    const rep = users.find((u) => u.id === order.salesRepId);
    const existing = byRep.get(order.salesRepId);
    if (existing) {
      existing.orderCount += 1;
      existing.revenue = round2(existing.revenue + order.totals.total);
    } else {
      byRep.set(order.salesRepId, {
        repId: order.salesRepId,
        name: rep?.fullName ?? order.salesRepId,
        orderCount: 1,
        revenue: order.totals.total,
      });
    }
  }
  return [...byRep.values()].sort((a, b) => b.revenue - a.revenue);
}

export interface RegionSalesRow {
  regionId: string;
  name: string;
  orderCount: number;
  revenue: number;
}

export function salesByRegion(orders: Order[], regions: DeliveryRegion[], locale: 'en' | 'ar'): RegionSalesRow[] {
  const byRegion = new Map<string, RegionSalesRow>();
  for (const order of orders) {
    const region = regions.find((r) => r.id === order.deliveryRegionId);
    const name = region?.name[locale] ?? order.deliveryRegionId;
    const existing = byRegion.get(order.deliveryRegionId);
    if (existing) {
      existing.orderCount += 1;
      existing.revenue = round2(existing.revenue + order.totals.total);
    } else {
      byRegion.set(order.deliveryRegionId, { regionId: order.deliveryRegionId, name, orderCount: 1, revenue: order.totals.total });
    }
  }
  return [...byRegion.values()].sort((a, b) => b.revenue - a.revenue);
}

export interface MonthlySalesRow {
  month: string;
  label: string;
  revenue: number;
}

/** Bucketed revenue for the last N months, including empty months at 0 — a continuous series for the bar chart. */
export function monthlySales(orders: Order[], months = 12): MonthlySalesRow[] {
  const buckets = new Map(lastNMonths(months).map(({ key, date }) => [key, { month: key, label: date.toLocaleDateString('en', { month: 'short' }), revenue: 0 }]));
  for (const order of orders) {
    const key = monthKey(new Date(order.createdAt));
    const bucket = buckets.get(key);
    if (bucket) bucket.revenue = round2(bucket.revenue + order.totals.total);
  }
  return [...buckets.values()];
}

export interface MonthlyMarginRow {
  month: string;
  label: string;
  revenue: number;
  margin: number;
}

/** Revenue vs. gross margin per month — margin uses each product's *current* cost price (line items don't snapshot cost), same simplification as marginByProduct. */
export function monthlyMargin(orders: Order[], products: Product[], months = 12): MonthlyMarginRow[] {
  const costById = new Map(products.map((p) => [p.id, p.costPrice]));
  const buckets = new Map(
    lastNMonths(months).map(({ key, date }) => [key, { month: key, label: date.toLocaleDateString('en', { month: 'short' }), revenue: 0, margin: 0 }])
  );
  for (const order of orders) {
    const key = monthKey(new Date(order.createdAt));
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.revenue = round2(bucket.revenue + order.totals.total);
    for (const item of order.items) {
      const cost = costById.get(item.productId) ?? 0;
      bucket.margin = round2(bucket.margin + (item.unitPriceSnapshot - cost) * item.quantity);
    }
  }
  return [...buckets.values()];
}

export interface OrderStatusBreakdownRow {
  status: OrderStatus;
  label: string;
  count: number;
}

export function orderStatusBreakdown(orders: Order[], locale: 'en' | 'ar'): OrderStatusBreakdownRow[] {
  const counts = new Map<OrderStatus, number>();
  for (const order of orders) {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([status, count]) => ({ status, label: ORDER_STATUS_LABELS[status][locale], count }))
    .sort((a, b) => b.count - a.count);
}

export interface ActivityRow {
  type: 'order' | 'customer';
  label: string;
  sublabel: string;
  at: string;
  link: string;
}

/** A merged, time-sorted feed of new orders and new customer signups for the dashboard's "Recent activity" panel. */
export function recentActivity(orders: Order[], users: UserProfile[], locale: 'en' | 'ar', limit = 8): ActivityRow[] {
  const orderRows: ActivityRow[] = orders.map((o) => ({
    type: 'order',
    label: o.orderNumber,
    sublabel: locale === 'en' ? 'New order' : 'أوردر جديد',
    at: o.createdAt,
    link: `/dashboard/orders/${o.id}`,
  }));
  const customerRows: ActivityRow[] = users
    .filter((u) => u.role === 'retail_customer' || u.role === 'wholesale_customer')
    .map((u) => ({
      type: 'customer',
      label: u.role === 'wholesale_customer' ? u.businessName : u.fullName,
      sublabel: locale === 'en' ? 'New customer' : 'عميل جديد',
      at: u.createdAt,
      link: `/dashboard/customers/${u.id}`,
    }));
  return [...orderRows, ...customerRows].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}
