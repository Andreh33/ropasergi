import { PRODUCTS } from '@/lib/data/products';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/drop`, lastModified: now, priority: 0.9 },
    { url: `${base}/manifiesto`, lastModified: now, priority: 0.7 },
    { url: `${base}/leyenda`, lastModified: now, priority: 0.3 },
  ];
  for (const p of PRODUCTS) {
    routes.push({ url: `${base}/producto/${p.slug}`, lastModified: now, priority: 0.8 });
  }
  return routes;
}
