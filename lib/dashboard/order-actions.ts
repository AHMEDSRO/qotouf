'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { orderRepository, productRepository, deliveryRepository, userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { buildLineItem, calculateTotals, initialPaymentStatus } from '@/lib/pricing/pricing';
import type { OrderStatus, PaymentMethod } from '@/lib/types/order';

export async function updateOrderStatusAction(locale: string, orderId: string, formData: FormData) {
  const status = formData.get('status') as OrderStatus;
  const ctx = await getRequestContext();
  await orderRepository.updateStatus(ctx, orderId, status);
  revalidatePath(`/${locale}/dashboard/orders/${orderId}`);
  revalidatePath(`/${locale}/dashboard/orders`);
}

export async function confirmPaymentReceivedAction(locale: string, orderId: string) {
  const ctx = await getRequestContext();
  await orderRepository.confirmPayment(ctx, orderId);
  revalidatePath(`/${locale}/dashboard/orders/${orderId}`);
  revalidatePath(`/${locale}/dashboard/orders`);
  revalidatePath(`/${locale}/dashboard`);
}

/** Manual order creation from the dashboard, for either a retail or wholesale customer — up to 5 product/quantity line slots. */
export async function createOrderAction(locale: string, formData: FormData) {
  const ctx = await getRequestContext();
  const customerId = String(formData.get('customerId'));
  const salesRepId = String(formData.get('salesRepId') || '') || undefined;
  const deliveryRegionId = String(formData.get('deliveryRegionId'));
  const paymentMethod = formData.get('paymentMethod') as PaymentMethod;

  const customer = await userRepository.getById(ctx, customerId);
  if (!customer || (customer.role !== 'retail_customer' && customer.role !== 'wholesale_customer')) {
    throw new Error('Invalid customer');
  }
  const accountType = customer.role === 'wholesale_customer' ? 'wholesale' : 'retail';

  const region = await deliveryRepository.getById(ctx, deliveryRegionId);
  if (!region) throw new Error('Invalid delivery region');

  const lineItems = [];
  for (let i = 0; i < 5; i++) {
    const productId = String(formData.get(`productId_${i}`) || '');
    const quantity = Number(formData.get(`quantity_${i}`) || 0);
    if (!productId || quantity <= 0) continue;
    const product = await productRepository.getById(ctx, productId);
    if (!product) continue;
    lineItems.push(buildLineItem(product, quantity));
  }
  if (lineItems.length === 0) throw new Error('At least one line item is required');

  const totals = calculateTotals(lineItems, region.deliveryFee);

  const order = await orderRepository.create(ctx, {
    accountType,
    customerId,
    salesRepId,
    items: lineItems,
    totals,
    status: 'pending_review',
    deliveryRegionId,
    paymentMethod,
    paymentStatus: initialPaymentStatus(paymentMethod),
  });

  revalidatePath(`/${locale}/dashboard/orders`);
  redirect(`/${locale}/dashboard/orders/${order.id}`);
}
