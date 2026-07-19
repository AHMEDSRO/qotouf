'use server';

import { revalidatePath } from 'next/cache';
import { userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

/** Only Super Admin sets a wholesale customer's credit limit — per spec, this is a manual, per-customer decision. */
export async function updateCreditLimitAction(locale: string, customerId: string, formData: FormData) {
  const ctx = await getRequestContext();
  if (ctx.role !== 'super_admin') throw new Error('Only Super Admin can set credit limits');

  const limit = Number(formData.get('limit'));
  const customer = await userRepository.getById(ctx, customerId);
  if (!customer || customer.role !== 'wholesale_customer') throw new Error('Wholesale customer not found');

  const currentBalance = customer.creditLimit.currentBalance;
  await userRepository.update(ctx, customerId, {
    creditLimit: { limit, currentBalance, availableCredit: Math.max(0, limit - currentBalance) },
  });

  revalidatePath(`/${locale}/dashboard/customers`);
}
