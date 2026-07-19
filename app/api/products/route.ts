import { NextRequest, NextResponse } from 'next/server';
import { productRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const ctx = await getRequestContext();
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');

  const products = await productRepository.list(ctx);
  const filtered = ids ? products.filter((p) => ids.split(',').includes(p.id)) : products;
  return NextResponse.json(filtered);
}
