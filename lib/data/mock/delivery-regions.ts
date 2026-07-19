import type { DeliveryRegion } from '@/lib/types/delivery';

export function seedDeliveryRegions(): DeliveryRegion[] {
  const regions: Array<[string, DeliveryRegion['emirate'], string, { en: string; ar: string }, number]> = [
    ['dxb-deira', 'dubai', 'Deira', { en: 'Deira', ar: 'ديرة' }, 15],
    ['dxb-marina', 'dubai', 'Dubai Marina', { en: 'Dubai Marina', ar: 'دبي مارينا' }, 15],
    ['dxb-jumeirah', 'dubai', 'Jumeirah', { en: 'Jumeirah', ar: 'جميرا' }, 15],
    ['auh-city', 'abu_dhabi', 'Abu Dhabi City', { en: 'Abu Dhabi City', ar: 'مدينة أبوظبي' }, 20],
    ['auh-khalifa', 'abu_dhabi', 'Khalifa City', { en: 'Khalifa City', ar: 'مدينة خليفة' }, 20],
    ['shj-city', 'sharjah', 'Sharjah City', { en: 'Sharjah City', ar: 'مدينة الشارقة' }, 12],
    ['ajm-city', 'ajman', 'Ajman City', { en: 'Ajman City', ar: 'مدينة عجمان' }, 12],
    ['uaq-city', 'umm_al_quwain', 'Umm Al Quwain City', { en: 'Umm Al Quwain City', ar: 'مدينة أم القيوين' }, 18],
    ['rak-city', 'ras_al_khaimah', 'Ras Al Khaimah City', { en: 'Ras Al Khaimah City', ar: 'مدينة رأس الخيمة' }, 20],
    ['fuj-city', 'fujairah', 'Fujairah City', { en: 'Fujairah City', ar: 'مدينة الفجيرة' }, 25],
  ];

  return regions.map(([id, emirate, area, name, deliveryFee]) => ({
    id,
    emirate,
    area,
    name,
    deliveryFee,
    isActive: true,
  }));
}
