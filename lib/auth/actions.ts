'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { userRepository } from '@/lib/data';
import type { Emirate } from '@/lib/types/common';

export async function signIn(email: string, password: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
}

const retailSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  emirate: z.string().min(1),
  area: z.string().min(1),
  street: z.string().min(1),
  locale: z.enum(['en', 'ar']),
});

export async function registerRetail(input: z.infer<typeof retailSchema>) {
  const data = retailSchema.parse(input);
  const supabase = createSupabaseServerClient();

  const { data: authData, error } = await supabase.auth.signUp({ email: data.email, password: data.password });
  if (error) throw new Error(error.message);
  if (!authData.user) throw new Error('Sign-up failed');

  const user = await userRepository.create(
    {
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
    },
    authData.user.id
  );

  return { user, needsEmailConfirmation: !authData.session };
}

const wholesaleSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  businessName: z.string().min(1),
  tradeLicenseNumber: z.string().optional(),
  locale: z.enum(['en', 'ar']),
});

export async function registerWholesale(input: z.infer<typeof wholesaleSchema>) {
  const data = wholesaleSchema.parse(input);
  const supabase = createSupabaseServerClient();

  const { data: authData, error } = await supabase.auth.signUp({ email: data.email, password: data.password });
  if (error) throw new Error(error.message);
  if (!authData.user) throw new Error('Sign-up failed');

  const user = await userRepository.create(
    {
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
    },
    authData.user.id
  );

  return { user, needsEmailConfirmation: !authData.session };
}
