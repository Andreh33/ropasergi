'use client';
import { NeonTag } from '@/components/ui/neon-tag';
import type { Product } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

function deriveCategory(p: Product): string {
  if (p.category?.trim()) return p.category;
  const n = p.name.toUpperCase();
  if (/HOODIE|SUDADERA/.test(n)) return 'Sudaderas';
  if (/T-?SHIRT|TEE|CAMISET/.test(n)) return 'Camisetas';
  if (/CARGO|PANT|PANTAL/.test(n)) return 'Pantalones';
  if (/JACKET|CHAQUETA|ABRIGO/.test(n)) return 'Chaquetas';
  if (/BOOT|BOTA|ZAPAT|SNEAKER/.test(n)) return 'Calzado';
  if (/TOTE|BAG|BOLSA|BALACLAVA|GORRO/.test(n)) return 'Accesorios';
  return 'Otros';
}

type Availability = 'all' | 'available' | 'soldout';
type Sort = 'featured' | 'price-asc' | 'price-desc';

function stockTag(p: Product) {
  if (p.status === 'soldout') return { label: 'AGOTADO', variant: 'blood' as const };
  const ratio = p.numbered.total > 0 ? p.numbered.available / p.numbered.total : 0;
  if (ratio >= 0.5) return { label: 'DISPONIBLE', variant: 'acid' as const };
  if (ratio >= 0.1) return { label: 'QUEDAN POCAS', variant: 'magenta' as const };
  return { label: `${p.numbered.available} DE ${p.numbered.total}`, variant: 'magenta' as const };
}

export function ShopGrid({ products }: { products: Product[] }) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState('all');
  const [color, setColor] = useState('all');
  const [availability, setAvailability] = useState<Availability>('all');
  const [sort, setSort] = useState<Sort>('featured');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(products.map(deriveCategory))).sort()],
    [products],
  );
  const allSizes = useMemo(() => {
    const s = new Set<string>();
    for (const p of products) for (const sz of p.sizes) s.add(sz);
    return Array.from(s);
  }, [products]);
  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) for (const c of p.colors ?? []) map.set(c.name, c.hex);
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== 'all' && deriveCategory(p) !== category) return false;
      if (size !== 'all' && !p.sizes.includes(size)) return false;
      if (color !== 'all' && !(p.colors ?? []).some((c) => c.name === color)) return false;
      if (availability === 'available' && p.status !== 'available') return false;
      if (availability === 'soldout' && p.status !== 'soldout') return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price.amount - b.price.amount);
    else if (sort === 'price-desc')
      list = [...list].sort((a, b) => b.price.amount - a.price.amount);
    return list;
  }, [products, category, size, color, availability, sort]);

  const prevState = useRef<Flip.FlipState | null>(null);
  useGSAP(
    () => {
      if (!gridRef.current || !prevState.current) return;
      Flip.from(prevState.current, {
        duration: 0.55,
        ease: 'power3.inOut',
        stagger: 0.025,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.3 }),
      });
    },
    { dependencies: [visible], scope: gridRef },
  );

  function snapshot() {
    if (gridRef.current) {
      prevState.current = Flip.getState(gridRef.current.querySelectorAll('[data-shop-card]'));
    }
  }

  const pill = (active: boolean) =>
    cn(
      'px-4 py-2 font-mono text-micro uppercase tracking-[0.18em] border transition-colors',
      active
        ? 'bg-[var(--acid)] text-[var(--bg-void)] border-[var(--acid)]'
        : 'text-[var(--ink-mute)] border-[var(--stroke-strong)] hover:text-[var(--ink)] hover:border-[var(--ink)]',
    );

  const hasFilters =
    category !== 'all' || size !== 'all' || color !== 'all' || availability !== 'all';

  return (
    <div
      className="pt-[14vh] pb-[14vh] bg-[var(--bg-void)] text-[var(--ink)] min-h-screen"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <header className="pb-8 grid grid-cols-12 gap-4 items-end">
        <p className="col-span-12 md:col-span-6 font-mono text-micro uppercase tracking-[0.18em] text-[var(--violet-glow)]">
          TIENDA · {products.length} {products.length === 1 ? 'PRENDA' : 'PRENDAS'} · MMXXVI
        </p>
        <h1 className="col-span-12 md:col-span-6 font-display text-display tracking-[-0.04em] leading-[0.9] uppercase text-right">
          LA TIENDA
        </h1>
      </header>

      {/* Barra de filtros sticky */}
      <div className="sticky top-[60px] z-20 -mx-[var(--grid-margin)] px-[var(--grid-margin)] py-4 bg-[var(--bg-void)]/90 backdrop-blur-md border-y border-[var(--stroke)] mb-10 space-y-3">
        {/* Categorías */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                snapshot();
                setCategory(c);
              }}
              className={pill(category === c)}
            >
              {c === 'all' ? 'TODO' : c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Tallas */}
          {allSizes.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                TALLA
              </span>
              <button
                type="button"
                onClick={() => {
                  snapshot();
                  setSize('all');
                }}
                className={pill(size === 'all')}
              >
                TODAS
              </button>
              {allSizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    snapshot();
                    setSize(s);
                  }}
                  className={cn(
                    'min-w-9 px-2 py-2 font-mono text-micro uppercase tracking-[0.12em] border transition-colors',
                    size === s
                      ? 'bg-[var(--acid)] text-[var(--bg-void)] border-[var(--acid)]'
                      : 'text-[var(--ink-mute)] border-[var(--stroke-strong)] hover:text-[var(--ink)]',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {/* Colores (swatches) */}
          {allColors.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                COLOR
              </span>
              <button
                type="button"
                onClick={() => {
                  snapshot();
                  setColor('all');
                }}
                className={pill(color === 'all')}
              >
                TODOS
              </button>
              {allColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  onClick={() => {
                    snapshot();
                    setColor(c.name);
                  }}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                    color === c.name
                      ? 'border-[var(--acid)] scale-110'
                      : 'border-[var(--stroke-strong)]',
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-label={`Color ${c.name}`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(
              [
                ['all', 'TODOS'],
                ['available', 'DISPONIBLE'],
                ['soldout', 'AGOTADO'],
              ] as [Availability, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  snapshot();
                  setAvailability(v);
                }}
                className={pill(availability === v)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  snapshot();
                  setCategory('all');
                  setSize('all');
                  setColor('all');
                  setAvailability('all');
                }}
                className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] hover:text-[var(--magenta)]"
              >
                LIMPIAR ✕
              </button>
            ) : null}
            <select
              value={sort}
              onChange={(e) => {
                snapshot();
                setSort(e.target.value as Sort);
              }}
              className="px-4 py-2 bg-[var(--bg-asphalt)] border border-[var(--stroke-strong)] font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink)]"
              aria-label="Ordenar"
            >
              <option value="featured">DESTACADOS</option>
              <option value="price-asc">PRECIO ↑</option>
              <option value="price-desc">PRECIO ↓</option>
            </select>
          </div>
        </div>
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {visible.length} {visible.length === 1 ? 'RESULTADO' : 'RESULTADOS'}
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {visible.map((p) => {
          const tag = stockTag(p);
          const first = p.images[0];
          const sold = p.status === 'soldout';
          return (
            <Link
              key={p.slug}
              href={sold ? '#' : `/producto/${p.slug}`}
              data-shop-card
              prefetch={!sold}
              aria-disabled={sold}
              className="group relative block bg-[var(--bg-asphalt)] overflow-hidden border border-transparent hover:border-[var(--violet)] transition-colors"
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
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(.18,0,0,1)] group-hover:scale-[1.06]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[var(--bg-void)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 grid place-items-center">
                  <span className="font-mono text-micro uppercase tracking-[0.18em] border border-[var(--acid)] text-[var(--acid)] px-5 py-2">
                    {sold ? 'AGOTADO' : 'VER PRENDA'}
                  </span>
                </div>
                {/* swatches de color */}
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
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-h3 tracking-[-0.02em] leading-[1] truncate">
                    {p.name}
                  </h3>
                  <span className="font-mono text-small shrink-0">
                    {formatPrice(p.price.amount)}
                  </span>
                </div>
                <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
                  {deriveCategory(p)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center font-serif italic text-h3 text-[var(--ink-mute)]">
          Nada con esos filtros. Prueba otra combinación.
        </p>
      ) : null}
    </div>
  );
}
