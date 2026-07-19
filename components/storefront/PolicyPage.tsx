import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n/config';

export function PolicyPage({ locale, titleEn, titleAr, children }: { locale: Locale; titleEn: string; titleAr: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl tracking-wide text-ink">{locale === 'en' ? titleEn : titleAr}</h1>
      <div className="prose-policy mt-6 space-y-4 text-ink-muted [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ms-5 [&_li]:list-disc [&_p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
