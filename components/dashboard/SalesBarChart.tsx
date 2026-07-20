'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthlySalesRow } from '@/lib/reports/aggregations';
import type { Locale } from '@/lib/i18n/config';

export function SalesBarChart({ data, locale }: { data: MonthlySalesRow[]; locale: Locale }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          formatter={(value) => [`AED ${Number(value).toLocaleString(locale === 'ar' ? 'ar-AE' : 'en-AE')}`, locale === 'en' ? 'Revenue' : 'الإيراد']}
          contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 12 }}
        />
        <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
