import type { LocalizedText } from './common';

export type OrderStatus =
  | 'pending_review'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export const ORDER_STATUS_LABELS: Record<OrderStatus, LocalizedText> = {
  pending_review: { en: 'Pending Review', ar: 'قيد المراجعة' },
  confirmed: { en: 'Confirmed', ar: 'مؤكد' },
  preparing: { en: 'Preparing', ar: 'قيد التجهيز' },
  out_for_delivery: { en: 'Out for Delivery', ar: 'خارج للتوصيل' },
  delivered: { en: 'Delivered', ar: 'تم التسليم' },
  cancelled: { en: 'Cancelled', ar: 'ملغي' },
  returned: { en: 'Returned', ar: 'مرتجع' },
};

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_review: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};

export interface OrderLineItem {
  productId: string;
  nameSnapshot: LocalizedText;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderTotals {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  deliveryFee: number;
  total: number;
}

export type PaymentMethod = 'card' | 'bank_transfer' | 'cash' | 'invoice_credit';
export type PaymentStatus = 'unpaid' | 'pending_confirmation' | 'paid' | 'partially_paid' | 'refunded';

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, LocalizedText> = {
  unpaid: { en: 'Unpaid', ar: 'غير مدفوع' },
  pending_confirmation: { en: 'Awaiting confirmation', ar: 'بانتظار التأكيد' },
  paid: { en: 'Paid', ar: 'مدفوع' },
  partially_paid: { en: 'Partially paid', ar: 'مدفوع جزئيًا' },
  refunded: { en: 'Refunded', ar: 'مسترجع' },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, LocalizedText> = {
  card: { en: 'Card', ar: 'بطاقة' },
  bank_transfer: { en: 'Bank transfer', ar: 'تحويل بنكي' },
  cash: { en: 'Cash', ar: 'كاش' },
  invoice_credit: { en: 'Invoice / credit', ar: 'فاتورة آجلة' },
};

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string;
  byUserId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  accountType: 'retail' | 'wholesale';
  customerId: string;
  salesRepId?: string | null;
  items: OrderLineItem[];
  totals: OrderTotals;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  deliveryRegionId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
