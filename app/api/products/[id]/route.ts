import { NextResponse } from 'next/server';
import { productRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const ctx = await getRequestContext();
  const product = await productRepository.getById(ctx, params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}
