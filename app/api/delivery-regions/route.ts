import { NextResponse } from 'next/server';
import { deliveryRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';

export async function GET() {
  const ctx = await getRequestContext();
  const regions = await deliveryRepository.list(ctx);
  return NextResponse.json(regions.filter((r) => r.isActive));
}
