import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { PRODUCTS } from '@/lib/data/products';
import type { Product } from '@/lib/types';

/**
 * Catálogo de productos con doble backend:
 *  - Producción: Vercel Blob (si BLOB_READ_WRITE_TOKEN está presente).
 *  - Desarrollo local: archivo .data/products.json (filesystem).
 *  - Fallback de solo lectura: los productos "seed" del código (PRODUCTS).
 *
 * El admin gestiona la lista completa. La primera vez que se guarda, se
 * persiste el catálogo entero (seed incluido) y a partir de ahí el store
 * es la fuente de verdad.
 */

const BLOB_KEY = 'catalog/products.json';
const LOCAL_DIR = path.join(process.cwd(), '.data');
const LOCAL_FILE = path.join(LOCAL_DIR, 'products.json');

const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

async function readFromBlob(): Promise<Product[] | null> {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: BLOB_KEY });
    const found = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!found) return null;
    const res = await fetch(found.url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as Product[];
  } catch {
    return null;
  }
}

async function writeToBlob(products: Product[]): Promise<void> {
  const { put } = await import('@vercel/blob');
  await put(BLOB_KEY, JSON.stringify(products, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readFromFile(): Promise<Product[] | null> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, 'utf8');
    return JSON.parse(raw) as Product[];
  } catch {
    return null;
  }
}

async function writeToFile(products: Product[]): Promise<void> {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(products, null, 2), 'utf8');
}

/** Lee el catálogo. Nunca lanza: si todo falla, devuelve los seed. */
export async function getCatalog(): Promise<Product[]> {
  const stored = hasBlob() ? await readFromBlob() : await readFromFile();
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  return PRODUCTS;
}

/** Persiste el catálogo completo. */
export async function saveCatalog(products: Product[]): Promise<void> {
  if (hasBlob()) {
    await writeToBlob(products);
  } else {
    await writeToFile(products);
  }
}

export async function getCatalogProduct(slug: string): Promise<Product | undefined> {
  const all = await getCatalog();
  return all.find((p) => p.slug === slug);
}

export async function upsertProduct(product: Product): Promise<Product[]> {
  const all = await getCatalog();
  const idx = all.findIndex((p) => p.slug === product.slug);
  if (idx >= 0) {
    all[idx] = product;
  } else {
    all.push(product);
  }
  await saveCatalog(all);
  return all;
}

export async function deleteProduct(slug: string): Promise<Product[]> {
  const all = await getCatalog();
  const next = all.filter((p) => p.slug !== slug);
  await saveCatalog(next);
  return next;
}

export function storageBackend(): 'blob' | 'filesystem' {
  return hasBlob() ? 'blob' : 'filesystem';
}
