'use client';
import { NeonTag } from '@/components/ui/neon-tag';
import { CATEGORY_LABEL } from '@/lib/data/brands';
import type { Product } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';
import { SlidersHorizontal, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

function deriveCategory(p: Product): string {
  if (p.category) return CATEGORY_LABEL[p.category] ?? p.category;
  // fallback legacy (productos antiguos sin categoría enum)
  const n = p.name.toUpperCase();
  if (/RELOJ|WATCH|DATEJUST|SUBMARINER|NAUTILUS|ROYAL OAK|SPEEDMASTER/.test(n)) return 'Relojes';
  return 'Chándales';
}

type Availability = 'all' | 'available' | 'soldout';
type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

function stockTag(p: Product) {
  if (p.status === 'soldout') return { label: 'AGOTADO', variant: 'blood' as const };
  const ratio = p.numbered.total > 0 ? p.numbered.available / p.numbered.total : 0;
  if (ratio >= 0.5) return { label: 'DISPONIBLE', variant: 'acid' as const };
  if (ratio >= 0.1) return { label: 'QUEDAN POCAS', variant: 'magenta' as const };
  return { label: `${p.numbered.available} DE ${p.numbered.total}`, variant: 'magenta' as const };
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-[var(--stroke)]">
      <h3 className="font-mono text-micro uppercase tracking-[0.22em] text-[var(--ink-mute)] mb-3">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  checked,
  onToggle,
  label,
  count,
  radio,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  count?: number;
  radio?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      data-cursor="button"
      className="group flex w-full items-center gap-3 text-left"
    >
      <span
        className={cn(
          'grid place-items-center w-4 h-4 shrink-0 border transition-colors',
          radio && 'rounded-full',
          checked
            ? 'bg-[var(--neon-azure)] border-[var(--neon-azure)]'
            : 'border-[var(--stroke-strong)] group-hover:border-[var(--ink)]',
        )}
      >
        {checked ? (
          <span className={cn('block w-1.5 h-1.5 bg-[var(--bg-void)]', radio && 'rounded-full')} />
        ) : null}
      </span>
      <span
        className={cn(
          'font-mono text-micro uppercase tracking-[0.14em] transition-colors',
          checked ? 'text-[var(--ink)]' : 'text-[var(--ink-mute)] group-hover:text-[var(--ink)]',
        )}
      >
        {label}
      </span>
      {count != null ? (
        <span className="ml-auto font-mono text-micro text-[var(--ink-faint)]">{count}</span>
      ) : null}
    </button>
  );
}

export function ShopGrid({ products }: { products: Product[] }) {
  const [cats, setCats] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>('all');
  const [sort, setSort] = useState<Sort>('featured');
  const [open, setOpen] = useState(false); // panel de filtros en móvil

  const catOptions = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      const c = deriveCategory(p);
      map.set(c, (map.get(c) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  const sizeOptions = useMemo(() => {
    const s = new Set<string>();
    for (const p of products) for (const sz of p.sizes) s.add(sz);
    return Array.from(s);
  }, [products]);

  const colorOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) for (const c of p.colors ?? []) map.set(c.name, c.hex);
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      if (cats.length && !cats.includes(deriveCategory(p))) return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (colors.length && !(p.colors ?? []).some((c) => colors.includes(c.name))) return false;
      if (availability === 'available' && p.status !== 'available') return false;
      if (availability === 'soldout' && p.status !== 'soldout') return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price.amount - b.price.amount);
    else if (sort === 'price-desc')
      list = [...list].sort((a, b) => b.price.amount - a.price.amount);
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, cats, sizes, colors, availability, sort]);

  const toggle = (value: string, list: string[], set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  const activeCount = cats.length + sizes.length + colors.length + (availability !== 'all' ? 1 : 0);

  const clear = () => {
    setCats([]);
    setSizes([]);
    setColors([]);
    setAvailability('all');
  };

  const sidebar = (
    <div className="lg:pr-2">
      <FilterGroup title="CATEGORÍA">
        {catOptions.map(([c, n]) => (
          <CheckRow
            key={c}
            checked={cats.includes(c)}
            onToggle={() => toggle(c, cats, setCats)}
            label={c}
            count={n}
          />
        ))}
      </FilterGroup>

      {sizeOptions.length > 0 ? (
        <FilterGroup title="TALLA">
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <button
                key={s}
                type="button"
                data-cursor="button"
                onClick={() => toggle(s, sizes, setSizes)}
                aria-pressed={sizes.includes(s)}
                className={cn(
                  'min-w-9 px-2 py-1.5 font-mono text-micro uppercase tracking-[0.1em] border transition-colors',
                  sizes.includes(s)
                    ? 'bg-[var(--neon-azure)] text-[var(--bg-void)] border-[var(--neon-azure)]'
                    : 'text-[var(--ink-mute)] border-[var(--stroke-strong)] hover:text-[var(--ink)] hover:border-[var(--ink)]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterGroup>
      ) : null}

      {colorOptions.length > 0 ? (
        <FilterGroup title="COLOR">
          <div className="flex flex-wrap gap-2.5">
            {colorOptions.map((c) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                data-cursor="button"
                onClick={() => toggle(c.name, colors, setColors)}
                aria-pressed={colors.includes(c.name)}
                aria-label={`Color ${c.name}`}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-transform hover:scale-110',
                  colors.includes(c.name)
                    ? 'border-[var(--neon-azure)] scale-110'
                    : 'border-[var(--stroke-strong)]',
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </FilterGroup>
      ) : null}

      <FilterGroup title="DISPONIBILIDAD">
        {(
          [
            ['all', 'TODO'],
            ['available', 'DISPONIBLE'],
            ['soldout', 'AGOTADO'],
          ] as [Availability, string][]
        ).map(([v, label]) => (
          <CheckRow
            key={v}
            radio
            checked={availability === v}
            onToggle={() => setAvailability(v)}
            label={label}
          />
        ))}
      </FilterGroup>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={clear}
          data-cursor="button"
          className="mt-5 flex items-center gap-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] hover:text-[var(--neon-blood)] transition-colors"
        >
          LIMPIAR FILTROS <X size={13} />
        </button>
      ) : null}
    </div>
  );

  return (
    <div
      className="shop-bg bg-[var(--bg-void)] text-[var(--ink)] min-h-screen pt-[14vh] pb-[12vh]"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <header className="pb-8 border-b border-[var(--stroke)] mb-8">
        <p className="font-mono text-micro uppercase tracking-[0.22em] text-[var(--ink-mute)] mb-3">
          TIENDA · {products.length} {products.length === 1 ? 'PRENDA' : 'PRENDAS'} · MMXXVI
        </p>
        <h1 className="font-display text-display tracking-[-0.04em] leading-[0.9] uppercase">
          LA TIENDA
        </h1>
      </header>

      {/* Toggle de filtros (móvil) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-cursor="button"
        className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2.5 border border-[var(--stroke-strong)] font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink)]"
      >
        <SlidersHorizontal size={14} />
        FILTROS{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12">
        {/* Sidebar de filtros */}
        <aside
          className={cn(
            'mb-8 lg:mb-0 lg:block lg:sticky lg:top-[88px] lg:self-start lg:max-h-[calc(100vh-110px)] lg:overflow-y-auto',
            open ? 'block' : 'hidden',
          )}
        >
          {sidebar}
        </aside>

        {/* Columna de resultados */}
        <main className="min-w-0">
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-[var(--stroke)] mb-6">
            <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
              {visible.length} {visible.length === 1 ? 'RESULTADO' : 'RESULTADOS'}
            </p>
            <label className="flex items-center gap-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
              ORDEN
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="px-3 py-2 bg-[var(--bg-asphalt)] border border-[var(--stroke-strong)] font-mono text-micro uppercase tracking-[0.14em] text-[var(--ink)]"
                aria-label="Ordenar"
              >
                <option value="featured">DESTACADOS</option>
                <option value="price-asc">PRECIO ↑</option>
                <option value="price-desc">PRECIO ↓</option>
                <option value="name">NOMBRE A-Z</option>
              </select>
            </label>
          </div>

          {visible.length === 0 ? (
            <div className="py-24 text-center space-y-5">
              <p className="font-serif italic text-h3 text-[var(--ink-mute)]">
                Ninguna prenda con esos filtros.
              </p>
              <button
                type="button"
                onClick={clear}
                data-cursor="button"
                className="font-mono text-micro uppercase tracking-[0.18em] border border-[var(--neon-azure)] text-[var(--neon-azure)] px-6 py-3 hover:bg-[var(--neon-azure)] hover:text-[var(--bg-void)] transition-colors"
              >
                LIMPIAR FILTROS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {visible.map((p) => {
                const tag = stockTag(p);
                const first = p.images[0];
                const sold = p.status === 'soldout';
                return (
                  <Link
                    key={p.slug}
                    href={sold ? '#' : `/producto/${p.slug}`}
                    prefetch={!sold}
                    aria-disabled={sold}
                    data-cursor="image"
                    className="neon-card group relative block bg-[var(--bg-asphalt)] overflow-hidden"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <div className="absolute top-3 left-3 z-10">
                        <NeonTag variant={tag.variant}>{tag.label}</NeonTag>
                      </div>
                      {first ? (
                        <Image
                          src={first.src}
                          alt={p.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 22vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(.18,0,0,1)] group-hover:scale-[1.05]"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-[var(--bg-void)]/55 opacity-0 group-hover:opacity-100 transition-opacity duration-500 grid place-items-center">
                        <span className="font-mono text-micro uppercase tracking-[0.18em] border border-[var(--neon-azure)] text-[var(--neon-azure)] px-5 py-2">
                          {sold ? 'AGOTADO' : 'VER PRENDA'}
                        </span>
                      </div>
                      {p.colors && p.colors.length > 0 ? (
                        <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                          {p.colors.slice(0, 4).map((c) => (
                            <span
                              key={c.name}
                              className="w-4 h-4 rounded-full border border-[var(--stroke-strong)]"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-[clamp(0.92rem,1.05vw,1.18rem)] tracking-[-0.02em] leading-[1.05] truncate">
                          {p.name}
                        </h3>
                        <span className="font-mono text-small shrink-0">
                          {formatPrice(p.price.amount)}
                        </span>
                      </div>
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-mute)]">
                        {deriveCategory(p)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
