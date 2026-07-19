import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { buildTemplateWorkbook } from '@/lib/excel/product-import';
import { getRequestContext } from '@/lib/auth/session';
import { can } from '@/lib/rbac/permissions';

export async function GET() {
  const ctx = getRequestContext();
  if (!can(ctx.role, 'bulk_import_products')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const workbook = buildTemplateWorkbook();
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="qtouf-product-import-template.xlsx"',
    },
  });
}
