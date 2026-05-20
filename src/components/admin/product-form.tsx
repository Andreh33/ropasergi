'use client';
import type { Product, ProductColor, ProductImage } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { useState } from 'react';

type Props = {
  initial: Product | null;
  onCancel: () => void;
  onSaved: (products: Product[]) => void;
};

const LABEL = 'block font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] mb-2';
const INPUT =
  'w-full px-3 py-3 bg-[var(--bg-asphalt)] border border-[var(--stroke-strong)] font-mono text-small text-[var(--ink)] focus:border-[var(--acid)]';

export function ProductForm({ initial, onCancel, onSaved }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [edition, setEdition] = useState(initial?.edition ?? '001 / 100');
  const [price, setPrice] = useState(String(initial?.price.amount ?? ''));
  const [total, setTotal] = useState(String(initial?.numbered.total ?? '100'));
  const [available, setAvailable] = useState(String(initial?.numbered.available ?? '100'));
  const [shortDescriptor, setShortDescriptor] = useState(initial?.shortDescriptor ?? '');
  const [editorial, setEditorial] = useState(initial?.editorial ?? '');
  const [material, setMaterial] = useState(initial?.technical.material ?? '');
  const [weight, setWeight] = useState(initial?.technical.weight ?? '');
  const [origin, setOrigin] = useState(initial?.technical.origin ?? '');
  const [tailoring, setTailoring] = useState(initial?.technical.tailoring ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [sizes, setSizes] = useState((initial?.sizes ?? ['UNICA']).join(', '));
  const [soldoutSizes, setSoldoutSizes] = useState((initial?.soldoutSizes ?? []).join(', '));
  const [care, setCare] = useState((initial?.care ?? []).join('\n'));
  const [status, setStatus] = useState<'available' | 'soldout'>(initial?.status ?? 'available');
  const [accent, setAccent] = useState<string>(initial?.accent ?? '');
  const [images, setImages] = useState<ProductImage[]>(initial?.images ?? []);
  const [colors, setColors] = useState<ProductColor[]>(initial?.colors ?? []);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#8b5cf6');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const added: ProductImage[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        added.push({ src: data.url, alt: name || file.name, type: 'front' });
      } else {
        setError(data.error ?? 'Error al subir una imagen.');
      }
    }
    setImages((prev) => [...prev, ...added]);
    setUploading(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      slug: slug || slugify(name),
      name,
      category,
      colors,
      edition,
      price: Number(price),
      total: Number(total),
      available: Number(available),
      shortDescriptor,
      editorial,
      material,
      weight: weight || undefined,
      origin,
      tailoring,
      sizes: sizes
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
      soldoutSizes: soldoutSizes
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
      care: care
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      status,
      accent: accent || undefined,
      images,
    };
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      onSaved(data.products ?? []);
    } else {
      setError(data.error ?? 'No se pudo guardar.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h3 tracking-[-0.03em] uppercase">
          {initial ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] hover:text-[var(--ink)]"
        >
          ← VOLVER
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={LABEL} htmlFor="f-name">
            NOMBRE *
          </label>
          <input
            id="f-name"
            className={INPUT}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!initial) setSlug(slugify(e.target.value));
            }}
            required
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-category">
            CATEGORÍA
          </label>
          <input
            id="f-category"
            className={INPUT}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Sudaderas, Camisetas, Calzado..."
            list="cat-suggestions"
          />
          <datalist id="cat-suggestions">
            <option value="Sudaderas" />
            <option value="Camisetas" />
            <option value="Pantalones" />
            <option value="Chaquetas" />
            <option value="Calzado" />
            <option value="Accesorios" />
          </datalist>
        </div>
        <div>
          <label className={LABEL} htmlFor="f-slug">
            SLUG (URL)
          </label>
          <input
            id="f-slug"
            className={INPUT}
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="se-genera-del-nombre"
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-price">
            PRECIO (€) *
          </label>
          <input
            id="f-price"
            type="number"
            className={INPUT}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-edition">
            EDICIÓN
          </label>
          <input
            id="f-edition"
            className={INPUT}
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            placeholder="001 / 100"
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-total">
            UNIDADES TOTALES
          </label>
          <input
            id="f-total"
            type="number"
            className={INPUT}
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-available">
            UNIDADES DISPONIBLES
          </label>
          <input
            id="f-available"
            type="number"
            className={INPUT}
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="f-desc">
          DESCRIPTOR CORTO (mono, mayúsculas)
        </label>
        <input
          id="f-desc"
          className={INPUT}
          value={shortDescriptor}
          onChange={(e) => setShortDescriptor(e.target.value)}
          placeholder="ALGODÓN COMPACTO · 480 GSM · PORTUGAL"
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="f-editorial">
          TEXTO EDITORIAL
        </label>
        <textarea
          id="f-editorial"
          className={`${INPUT} min-h-32`}
          value={editorial}
          onChange={(e) => setEditorial(e.target.value)}
          placeholder="Doble salto de línea para separar párrafos."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={LABEL} htmlFor="f-material">
            MATERIAL
          </label>
          <input
            id="f-material"
            className={INPUT}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-weight">
            PESO (opcional)
          </label>
          <input
            id="f-weight"
            className={INPUT}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="480 g/m²"
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-origin">
            ORIGEN
          </label>
          <input
            id="f-origin"
            className={INPUT}
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-tailoring">
            CONFECCIÓN
          </label>
          <input
            id="f-tailoring"
            className={INPUT}
            value={tailoring}
            onChange={(e) => setTailoring(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={LABEL} htmlFor="f-sizes">
            TALLAS (separadas por coma)
          </label>
          <input
            id="f-sizes"
            className={INPUT}
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="XS, S, M, L, XL"
          />
        </div>
        <div>
          <label className={LABEL} htmlFor="f-soldout">
            TALLAS AGOTADAS (coma)
          </label>
          <input
            id="f-soldout"
            className={INPUT}
            value={soldoutSizes}
            onChange={(e) => setSoldoutSizes(e.target.value)}
            placeholder="XS"
          />
        </div>
      </div>

      <div>
        <label className={LABEL} htmlFor="f-care">
          CUIDADOS (un punto por línea)
        </label>
        <textarea
          id="f-care"
          className={`${INPUT} min-h-24`}
          value={care}
          onChange={(e) => setCare(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={LABEL} htmlFor="f-status">
            ESTADO
          </label>
          <select
            id="f-status"
            className={INPUT}
            value={status}
            onChange={(e) => setStatus(e.target.value as 'available' | 'soldout')}
          >
            <option value="available">Disponible</option>
            <option value="soldout">Agotado</option>
          </select>
        </div>
        <div>
          <label className={LABEL} htmlFor="f-accent">
            ACENTO DE COLOR
          </label>
          <select
            id="f-accent"
            className={INPUT}
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          >
            <option value="">Ninguno</option>
            <option value="acid">Ácido</option>
            <option value="magenta">Magenta</option>
            <option value="cyber">Cyber</option>
          </select>
        </div>
      </div>

      {/* Colores */}
      <div>
        <label className={LABEL}>COLORES (para el filtro de la tienda)</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {colors.map((c, i) => (
            <span
              key={`${c.hex}-${i}`}
              className="inline-flex items-center gap-2 pl-2 pr-1 py-1 border border-[var(--stroke-strong)] font-mono text-micro uppercase tracking-[0.12em]"
            >
              <span
                className="w-4 h-4 border border-[var(--stroke-strong)]"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
              <button
                type="button"
                onClick={() => setColors((prev) => prev.filter((_, j) => j !== i))}
                className="w-5 h-5 grid place-items-center text-[var(--ink-mute)] hover:text-[var(--blood)]"
                aria-label={`Quitar ${c.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="w-12 h-10 bg-transparent border border-[var(--stroke-strong)] cursor-pointer"
            aria-label="Elegir color"
          />
          <input
            className={`${INPUT} flex-1 min-w-[140px]`}
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="Nombre del color (ej. Negro)"
          />
          <button
            type="button"
            onClick={() => {
              if (!colorName.trim()) return;
              setColors((prev) => [...prev, { name: colorName.trim(), hex: colorHex }]);
              setColorName('');
            }}
            className="px-5 py-3 border border-[var(--violet)] text-[var(--violet-glow)] font-mono text-micro uppercase tracking-[0.18em] hover:bg-[var(--violet)] hover:text-[var(--ink)]"
          >
            AÑADIR COLOR
          </button>
        </div>
      </div>

      {/* Imágenes */}
      <div>
        <label className={LABEL}>FOTOS (se suben a Vercel Blob)</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={`${img.src}-${i}`} className="relative w-24 h-32 bg-[var(--bg-tarmac)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute -top-2 -right-2 w-6 h-6 grid place-items-center bg-[var(--blood)] text-[var(--ink)] font-mono text-xs"
                aria-label="Quitar foto"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onUpload(e.target.files)}
          disabled={uploading}
          className="font-mono text-micro text-[var(--ink-mute)]"
        />
        {uploading ? (
          <p className="mt-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--acid)]">
            SUBIENDO...
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--blood)]">
          {error}
        </p>
      ) : null}

      <div className="flex gap-4 pt-4 border-t border-[var(--stroke)]">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-8 py-4 bg-[var(--acid)] text-[var(--bg-void)] font-mono text-micro uppercase tracking-[0.18em] disabled:opacity-50"
        >
          {saving ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 border border-[var(--stroke-strong)] font-mono text-micro uppercase tracking-[0.18em]"
        >
          CANCELAR
        </button>
      </div>
    </form>
  );
}
