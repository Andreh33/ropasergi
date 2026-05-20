import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function safeName(name: string): string {
  const ext = path.extname(name).toLowerCase() || '.jpg';
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `${base || 'foto'}-${Date.now()}${ext}`;
}

/**
 * Sube una imagen y devuelve su URL pública.
 *  - Con BLOB_READ_WRITE_TOKEN: Vercel Blob.
 *  - Sin token (dev local): la guarda en public/uploads/.
 */
export async function uploadImage(file: File): Promise<string> {
  const filename = safeName(file.name);

  if (hasBlob()) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`products/${filename}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    return blob.url;
  }

  // Fallback local: escribe en public/uploads
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
