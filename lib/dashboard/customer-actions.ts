'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { userRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import { assertCan } from '@/lib/rbac/permissions';
import { supabaseAdmin } from '@/lib/supabase/admin-client';
import type { Emirate } from '@/lib/types/common';

const createCustomerSchema = z.object({
  role: z.enum(['retail_customer', 'wholesale_customer']),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  emirate: z.string().optional(),
  area: z.string().optional(),
  street: z.string().optional(),
  businessName: z.string().optional(),
  tradeLicenseNumber: z.string().optional(),
});

/**
 * A manual "phone order" customer gets a real login immediately, the same
 * invite-email flow already used for staff (lib/dashboard/staff-actions.ts) —
 * Ahmed confirmed this over a login-less record.
 */
export async function createCustomerAction(locale: string, formData: FormData) {
  const ctx = await getRequestContext();
  assertCan(ctx.role, 'create_wholesale_order');

  const data = createCustomerSchema.parse(Object.fromEntries(formData.entries()));

  const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email);
  if (error) throw new Error(error.message);
  if (!invited.user) throw new Error('Invite failed');

  const base = { email: data.email, fullName: data.fullName, phone: data.phone, locale: 'en' as const };

  if (data.role === 'retail_customer') {
    if (!data.emirate || !data.area || !data.street) throw new Error('Address is required for a retail customer');
    await userRepository.create(
      {
        ...base,
        role: 'retail_customer',
        addresses: [{ id: 'addr-1', label: 'Home', emirate: data.emirate as Emirate, area: data.area, street: data.street }],
      },
      invited.user.id
    );
  } else {
    if (!data.businessName) throw new Error('Business name is required for a wholesale customer');
    await userRepository.create(
      {
        ...base,
        role: 'wholesale_customer',
        businessName: data.businessName,
        tradeLicenseNumber: data.tradeLicenseNumber,
        creditLimit: { limit: 0, currentBalance: 0, availableCredit: 0 },
        assignedSalesRepId: null,
        approvedForWholesalePricing: true,
      },
      invited.user.id
    );
  }

  revalidatePath(`/${locale}/dashboard/customers`);
  redirect(`/${locale}/dashboard/customers`);
}

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
