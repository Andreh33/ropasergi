import { getCatalog } from '@/lib/server/catalog';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getCatalog();
  return NextResponse.json({ products });
}
