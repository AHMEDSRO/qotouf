import { supabaseAdmin } from '@/lib/supabase/admin-client';
import type { PlatformSettings } from '@/lib/types/settings';
import { assertCan } from '@/lib/rbac/permissions';
import type { SettingsRepository } from '../settings-repository';

interface SettingsRow {
  id: string;
  whatsapp_number: string | null;
  invoice_emails: string[];
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_iban: string | null;
  updated_at: string;
}

function toSettings(row: SettingsRow): PlatformSettings {
  return {
    whatsappNumber: row.whatsapp_number,
    invoiceEmails: row.invoice_emails,
    bankName: row.bank_name,
    bankAccountName: row.bank_account_name,
    bankAccountNumber: row.bank_account_number,
    bankIban: row.bank_iban,
    updatedAt: row.updated_at,
  };
}

const DEFAULTS: PlatformSettings = {
  whatsappNumber: null,
  invoiceEmails: [],
  bankName: null,
  bankAccountName: null,
  bankAccountNumber: null,
  bankIban: null,
  updatedAt: new Date(0).toISOString(),
};

export const supabaseSettingsRepository: SettingsRepository = {
  async get() {
    // Falls back to defaults instead of throwing if the table isn't there yet — this
    // repository is called from the root layout on every page, so a migration that
    // hasn't landed yet must not take the whole site down.
    const { data, error } = await supabaseAdmin.from('platform_settings').select('*').eq('id', 'default').maybeSingle();
    if (error) return DEFAULTS;
    return data ? toSettings(data as SettingsRow) : DEFAULTS;
  },

  async update(ctx, patch) {
    assertCan(ctx.role, 'manage_payment_settings');
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.whatsappNumber !== undefined) row.whatsapp_number = patch.whatsappNumber;
    if (patch.invoiceEmails !== undefined) row.invoice_emails = patch.invoiceEmails;
    if (patch.bankName !== undefined) row.bank_name = patch.bankName;
    if (patch.bankAccountName !== undefined) row.bank_account_name = patch.bankAccountName;
    if (patch.bankAccountNumber !== undefined) row.bank_account_number = patch.bankAccountNumber;
    if (patch.bankIban !== undefined) row.bank_iban = patch.bankIban;

    const { data, error } = await supabaseAdmin.from('platform_settings').update(row).eq('id', 'default').select().single();
    if (error) throw error;
    return toSettings(data as SettingsRow);
  },
};
