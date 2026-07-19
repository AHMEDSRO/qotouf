import { NextResponse } from 'next/server';
import { orderRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const ctx = await getRequestContext();
  try {
    const order = await orderRepository.getById(ctx, params.id);
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
