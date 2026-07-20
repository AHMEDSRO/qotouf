'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { settingsRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

const settingsSchema = z.object({
  whatsappNumber: z.string().optional(),
  invoiceEmails: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIban: z.string().optional(),
});

export async function updatePlatformSettingsAction(locale: string, formData: FormData) {
  const ctx = await getRequestContext();
  const data = settingsSchema.parse(Object.fromEntries(formData.entries()));

  await settingsRepository.update(ctx, {
    whatsappNumber: data.whatsappNumber || null,
    invoiceEmails: (data.invoiceEmails ?? '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean),
    bankName: data.bankName || null,
    bankAccountName: data.bankAccountName || null,
    bankAccountNumber: data.bankAccountNumber || null,
    bankIban: data.bankIban || null,
  });

  revalidatePath(`/${locale}/dashboard/settings/payments`);
  revalidatePath(`/${locale}`);
}
