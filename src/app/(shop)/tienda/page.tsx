import { ShopGrid } from '@/components/sections/shop-grid';
import { getCatalog } from '@/lib/server/catalog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LA TIENDA',
  description: 'Chándales y relojes de lujo seleccionados y autenticados. Tarragona, MMXXVI.',
};

export const dynamic = 'force-dynamic';

export default async function TiendaPage() {
  const products = await getCatalog();
  return <ShopGrid products={products} />;
}
