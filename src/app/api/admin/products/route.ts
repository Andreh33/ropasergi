import { formToProduct, productFormSchema } from '@/lib/product-schema';
import { isAuthenticated } from '@/lib/server/auth';
import { deleteProduct, getCatalog, storageBackend, upsertProduct } from '@/lib/server/catalog';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const products = await getCatalog();
  return NextResponse.json({ products, backend: storageBackend() });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = productFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' },
      { status: 400 },
    );
  }
  const product = formToProduct(parsed.data);
  const products = await upsertProduct(product);
  return NextResponse.json({ ok: true, product, products });
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'Falta el slug.' }, { status: 400 });
  }
  const products = await deleteProduct(slug);
  return NextResponse.json({ ok: true, products });
}
