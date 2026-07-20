import type { Product } from '@/lib/types/product';
import type { OrderLineItem, OrderTotals, PaymentMethod, PaymentStatus } from '@/lib/types/order';
import { calculateVat, round2, VAT_RATE } from './vat';

export type AccountType = 'retail' | 'wholesale';

type PriceableProduct = Pick<Product, 'id' | 'name' | 'price'>;

export function buildLineItem(product: PriceableProduct, quantity: number): OrderLineItem {
  const unitPriceSnapshot = product.price;
  return {
    productId: product.id,
    nameSnapshot: product.name,
    unitPriceSnapshot,
    quantity,
    lineTotal: round2(unitPriceSnapshot * quantity),
  };
}

/** A bank transfer isn't verified as received until an accountant confirms it — every other method starts unpaid and gets settled through the normal order flow. */
export function initialPaymentStatus(paymentMethod: PaymentMethod): PaymentStatus {
  return paymentMethod === 'bank_transfer' ? 'pending_confirmation' : 'unpaid';
}

export function calculateTotals(items: OrderLineItem[], deliveryFee: number): OrderTotals {
  const subtotal = round2(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const vatAmount = calculateVat(subtotal);
  return {
    subtotal,
    vatRate: VAT_RATE,
    vatAmount,
    deliveryFee,
    total: round2(subtotal + vatAmount + deliveryFee),
  };
}
