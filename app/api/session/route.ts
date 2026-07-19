import { NextResponse } from 'next/server';
import { getRequestContext } from '@/lib/auth/session';

export async function GET() {
  return NextResponse.json(getRequestContext());
}
