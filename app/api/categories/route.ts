import { NextResponse } from 'next/server';
import { categoryRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

export async function GET() {
  const ctx = await getRequestContext();
  const categories = await categoryRepository.list(ctx);
  return NextResponse.json(categories);
}
