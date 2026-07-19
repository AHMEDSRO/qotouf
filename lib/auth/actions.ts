'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { userRepository } from '@/lib/data';
import type { Emirate } from '@/lib/types/common';
import { SESSION_COOKIE } from './constants';

export async function setSessionUser(userId: string) {
  cookies().set(SESSION_COOKIE, userId, { path: '/', maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSession() {
  cookies().delete(SESSION_COOKIE);
}

const retailSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  emirate: z.string().min(1),
  area: z.string().min(1),
  street: z.string().min(1),
  locale: z.enum(['en', 'ar']),
});

export async function registerRetail(input: z.infer<typeof retailSchema>) {
  const data = retailSchema.parse(input);
  const user = await userRepository.create({
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    role: 'retail_customer',
    locale: data.locale,
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        emirate: data.emirate as Emirate,
        area: data.area,
        street: data.street,
      },
    ],
  });
  await setSessionUser(user.id);
  return user;
}

const wholesaleSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  businessName: z.string().min(1),
  tradeLicenseNumber: z.string().optional(),
  locale: z.enum(['en', 'ar']),
});

export async function registerWholesale(input: z.infer<typeof wholesaleSchema>) {
  const data = wholesaleSchema.parse(input);
  const user = await userRepository.create({
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    role: 'wholesale_customer',
    locale: data.locale,
    businessName: data.businessName,
    tradeLicenseNumber: data.tradeLicenseNumber,
    creditLimit: { limit: 0, currentBalance: 0, availableCredit: 0 },
    assignedSalesRepId: null,
    approvedForWholesalePricing: true,
  });
  await setSessionUser(user.id);
  return user;
}
