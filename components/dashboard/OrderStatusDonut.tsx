'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { OrderStatusBreakdownRow } from '@/lib/reports/aggregations';
import type { OrderStatus } from '@/lib/types/order';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_review: '#c9bfa0',
  confirmed: '#5b8c6e',
  preparing: '#e6552d',
  out_for_delivery: '#d98c3f',
  delivered: '#1f4d36',
  cancelled: '#8a3b2f',
  returned: '#5b6355',
};

export function OrderStatusDonut({ data }: { data: OrderStatusBreakdownRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="label" innerRadius={50} outerRadius={80} paddingAngle={2}>
          {data.map((row) => (
            <Cell key={row.status} fill={STATUS_COLORS[row.status]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
