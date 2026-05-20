import { ProductInfo } from '@/components/pdp/product-info';
import { RelatedProducts } from '@/components/pdp/related-products';
import { Viewer3DShell } from '@/components/pdp/viewer-3d-shell';
import { WhoWearsIt } from '@/components/pdp/who-wears-it';
import { PRODUCTS } from '@/lib/data/products';
import { getCatalog, getCatalogProduct } from '@/lib/server/catalog';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ slug: string }> };

// Pre-renderiza los productos seed; los añadidos por el admin se sirven on-demand.
export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getCatalogProduct(slug);
  if (!p) return { title: 'Producto no encontrado' };
  return {
    title: p.name,
    description: p.editorial.slice(0, 150),
    openGraph: { title: p.name, description: p.editorial.slice(0, 150) },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();

  const catalog = await getCatalog();
  const related = catalog.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <article className="relative bg-[var(--bg-void)]">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-0 pt-[10vh] md:pt-0">
        <div className="md:col-span-7 md:sticky md:top-0 md:h-[100dvh] relative">
          <Viewer3DShell product={product} />
        </div>
        <div className="md:col-span-5" style={{ paddingLeft: 'var(--grid-margin)' }}>
          <ProductInfo product={product} />
        </div>
      </div>

      <WhoWearsIt />
      <RelatedProducts products={related} />
    </article>
  );
}
