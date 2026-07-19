import { NextRequest, NextResponse } from 'next/server';
import { productRepository } from '@/lib/data';
import { getRequestContext } from '@/lib/auth/session';
import type { NewProduct } from '@/lib/excel/product-import';

export async function POST(request: NextRequest) {
  const ctx = await getRequestContext();
  const body = (await request.json()) as { rows: NewProduct[] };

  if (!body.rows?.length) {
    return NextResponse.json({ error: 'No rows to import' }, { status: 400 });
  }

  try {
    const created = await productRepository.bulkImport(ctx, body.rows);
    return NextResponse.json({ imported: created.length });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Import failed' }, { status: 403 });
  }
}
