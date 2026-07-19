'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { COUNTRY_LABELS } from '@/lib/data/countries';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function Filters({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [country, setCountry] = useState(searchParams.get('country') ?? '');

  function apply(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    minPrice ? params.set('minPrice', minPrice) : params.delete('minPrice');
    maxPrice ? params.set('maxPrice', maxPrice) : params.delete('maxPrice');
    country ? params.set('country', country) : params.delete('country');
    router.push(`${pathname}?${params.toString()}`);
  }

  function reset() {
    setMinPrice('');
    setMaxPrice('');
    setCountry('');
    router.push(pathname);
  }

  return (
    <form onSubmit={apply} className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {locale === 'en' ? 'Price (AED)' : 'السعر (درهم)'}
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={locale === 'en' ? 'Min' : 'من'}
          />
          <span className="text-ink-muted">–</span>
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={locale === 'en' ? 'Max' : 'إلى'}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {locale === 'en' ? 'Country of origin' : 'بلد المنشأ'}
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="h-10 w-full rounded-card border border-border bg-surface px-3 text-sm text-ink"
        >
          <option value="">{locale === 'en' ? 'All countries' : 'كل الدول'}</option>
          {Object.entries(COUNTRY_LABELS).map(([code, label]) => (
            <option key={code} value={code}>
              {label[locale]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          {locale === 'en' ? 'Apply' : 'تطبيق'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={reset}>
          {locale === 'en' ? 'Reset' : 'إعادة تعيين'}
        </Button>
      </div>
    </form>
  );
}
