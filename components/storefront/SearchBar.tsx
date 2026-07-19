'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { Input } from '@/components/ui/Input';

export function SearchBar({ locale, placeholder, defaultValue }: { locale: Locale; placeholder: string; defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set('q', value.trim());
    router.push(`/${locale}/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="ps-9"
        aria-label={placeholder}
      />
    </form>
  );
}
