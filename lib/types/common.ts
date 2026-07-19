export type Locale = 'en' | 'ar';

export type LocalizedText = {
  en: string;
  ar: string;
};

export type Emirate =
  | 'abu_dhabi'
  | 'dubai'
  | 'sharjah'
  | 'ajman'
  | 'umm_al_quwain'
  | 'ras_al_khaimah'
  | 'fujairah';

export const EMIRATE_LABELS: Record<Emirate, LocalizedText> = {
  abu_dhabi: { en: 'Abu Dhabi', ar: 'أبوظبي' },
  dubai: { en: 'Dubai', ar: 'دبي' },
  sharjah: { en: 'Sharjah', ar: 'الشارقة' },
  ajman: { en: 'Ajman', ar: 'عجمان' },
  umm_al_quwain: { en: 'Umm Al Quwain', ar: 'أم القيوين' },
  ras_al_khaimah: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' },
  fujairah: { en: 'Fujairah', ar: 'الفجيرة' },
};
