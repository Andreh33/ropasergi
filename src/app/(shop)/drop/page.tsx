import { ShopGrid } from '@/components/sections/shop-grid';
import { getCatalog } from '@/lib/server/catalog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EL DROP',
  description: 'Ocho objetos numerados. Cuando se agoten, no volveremos a hacerlos.',
};

export const dynamic = 'force-dynamic';

export default async function DropPage() {
  const products = await getCatalog();
  return <ShopGrid products={products} />;
}
