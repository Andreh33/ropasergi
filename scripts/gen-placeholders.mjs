// Genera placeholders locales para las fotos de producto (mientras no haya
// fotos reales). Fondo void + nombre de marca + acento neón (azul chándal /
// rojo reloj). Salida: public/products/_ph/{BRAND}-{1,2}.png
// Uso: node scripts/gen-placeholders.mjs
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const VOID = '#050507';
const INK = '#F5F1E8';
const MUTE = '#807E86';
const AZURE = '#1E63FF';
const BLOOD = '#FF1230';

const BRANDS = [
  ['VERSACE', 'Versace', 'CHANDAL'],
  ['LOUIS_VUITTON', 'Louis Vuitton', 'CHANDAL'],
  ['NIKE', 'Nike', 'CHANDAL'],
  ['DIOR', 'Dior', 'CHANDAL'],
  ['GUCCI', 'Gucci', 'CHANDAL'],
  ['BALENCIAGA', 'Balenciaga', 'CHANDAL'],
  ['PRADA', 'Prada', 'CHANDAL'],
  ['FENDI', 'Fendi', 'CHANDAL'],
  ['OFF_WHITE', 'Off-White', 'CHANDAL'],
  ['MONCLER', 'Moncler', 'CHANDAL'],
  ['BURBERRY', 'Burberry', 'CHANDAL'],
  ['ROLEX', 'Rolex', 'RELOJ'],
  ['AUDEMARS_PIGUET', 'Audemars Piguet', 'RELOJ'],
  ['PATEK_PHILIPPE', 'Patek Philippe', 'RELOJ'],
  ['CARTIER', 'Cartier', 'RELOJ'],
  ['IWC', 'IWC', 'RELOJ'],
  ['OMEGA', 'Omega', 'RELOJ'],
];

const W = 1000;
const H = 1250;

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function svg(name, cat, variant) {
  const accent = cat === 'RELOJ' ? BLOOD : AZURE;
  const label = cat === 'RELOJ' ? 'RELOJ' : 'CHÁNDAL';
  const upper = name.toUpperCase();
  const fontSize = Math.min(104, Math.floor(940 / (upper.length * 0.6)));
  const barY = variant === 1 ? 0 : H - 12;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${VOID}"/>
  <rect x="0" y="${barY}" width="${W}" height="12" fill="${accent}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${accent}" stroke-opacity="0.22" stroke-width="2"/>
  <text x="${W / 2}" y="585" fill="${INK}" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${fontSize}" letter-spacing="-3" text-anchor="middle">${esc(upper)}</text>
  <text x="${W / 2}" y="660" fill="${accent}" font-family="monospace" font-size="34" letter-spacing="10" text-anchor="middle">${label}</text>
  <text x="${W / 2}" y="${H - 70}" fill="${MUTE}" font-family="monospace" font-size="22" letter-spacing="6" text-anchor="middle">PROYECTO 1 · FOTO ${variant} · PENDIENTE</text>
</svg>`;
}

const outDir = path.join(process.cwd(), 'public', 'products', '_ph');
await mkdir(outDir, { recursive: true });

let n = 0;
for (const [key, name, cat] of BRANDS) {
  for (const variant of [1, 2]) {
    const buf = Buffer.from(svg(name, cat, variant));
    const out = path.join(outDir, `${key}-${variant}.png`);
    await sharp(buf).png({ quality: 90 }).toFile(out);
    n++;
  }
}
console.log(`Generadas ${n} imágenes en public/products/_ph/`);
