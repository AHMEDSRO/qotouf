import { readCollection, writeCollection } from '@/lib/data/store';
import type { PlatformSettings } from '@/lib/types/settings';
import { assertCan } from '@/lib/rbac/permissions';
import type { SettingsRepository } from '../settings-repository';

const DEFAULTS: PlatformSettings = {
  whatsappNumber: null,
  invoiceEmails: [],
  bankName: null,
  bankAccountName: null,
  bankAccountNumber: null,
  bankIban: null,
  updatedAt: new Date(0).toISOString(),
};

function loadAll(): PlatformSettings[] {
  return readCollection<PlatformSettings>('settings', () => [DEFAULTS]);
}

export const mockSettingsRepository: SettingsRepository = {
  async get() {
    return loadAll()[0] ?? DEFAULTS;
  },

  async update(ctx, patch) {
    assertCan(ctx.role, 'manage_payment_settings');
    const current = loadAll()[0] ?? DEFAULTS;
    const updated: PlatformSettings = { ...current, ...patch, updatedAt: new Date().toISOString() };
    writeCollection('settings', [updated]);
    return updated;
  },
};
