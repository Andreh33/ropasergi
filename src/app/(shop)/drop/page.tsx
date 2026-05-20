import { ShopGrid } from '@/components/sections/shop-grid';
import { getCatalog } from '@/lib/server/catalog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LA TIENDA',
  description: 'Prendas numeradas. Cuando se agotan, no volvemos a hacerlas.',
};

export const dynamic = 'force-dynamic';

export default async function DropPage() {
  const products = await getCatalog();
  return <ShopGrid products={products} />;
}
