'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import type { MonthlyMarginRow } from '@/lib/reports/aggregations';
import type { Locale } from '@/lib/i18n/config';

export function MarginLineChart({ data, locale }: { data: MonthlyMarginRow[]; locale: Locale }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-ink-muted)' }} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          formatter={(value) => `AED ${Number(value).toLocaleString(locale === 'ar' ? 'ar-AE' : 'en-AE')}`}
          contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} formatter={(value) => (value === 'revenue' ? (locale === 'en' ? 'Revenue' : 'الإيراد') : locale === 'en' ? 'Margin' : 'الهامش')} />
        <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="margin" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
