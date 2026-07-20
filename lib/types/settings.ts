export interface PlatformSettings {
  whatsappNumber: string | null;
  invoiceEmails: string[];
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  bankIban: string | null;
  updatedAt: string;
}

export type PlatformSettingsPatch = Partial<Omit<PlatformSettings, 'updatedAt'>>;
