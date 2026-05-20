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

function categoryOf(p: Product): string {
  const n = p.name.toUpperCase();
  if (/HOODIE|SUDADERA/.test(n)) return 'Sudaderas';
  if (/T-?SHIRT|TEE|CAMISET/.test(n)) return 'Camisetas';
  if (/CARGO|PANT|PANTAL|KEROSEN/.test(n)) return 'Pantalones';
  if (/JACKET|CHAQUETA|ABRIGO|SIGILO/.test(n)) return 'Chaquetas';
  if (/BOOT|BOTA|ZAPAT|SNEAKER|MONOLITO/.test(n)) return 'Calzado';
  if (/TOTE|BAG|BOLSA|BALACLAVA|GORRO|NEÓN|NEON|ACCES/.test(n)) return 'Accesorios';
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
  const [category, setCategory] = useState<string>('all');
  const [availability, setAvailability] = useState<Availability>('all');
  const [sort, setSort] = useState<Sort>('featured');

  const categories = useMemo(() => {
    const set = new Set(products.map(categoryOf));
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== 'all' && categoryOf(p) !== category) return false;
      if (availability === 'available' && p.status !== 'available') return false;
      if (availability === 'soldout' && p.status !== 'soldout') return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price.amount - b.price.amount);
    else if (sort === 'price-desc')
      list = [...list].sort((a, b) => b.price.amount - a.price.amount);
    return list;
  }, [products, category, availability, sort]);

  // Reordenado animado con GSAP Flip cuando cambian los filtros.
  const prevState = useRef<Flip.FlipState | null>(null);
  useGSAP(
    () => {
      if (!gridRef.current) return;
      if (prevState.current) {
        Flip.from(prevState.current, {
          duration: 0.6,
          ease: 'power3.inOut',
          stagger: 0.03,
          absolute: true,
          onEnter: (els) =>
            gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3 }),
        });
      }
    },
    { dependencies: [visible], scope: gridRef },
  );

  function beforeChange() {
    if (gridRef.current) {
      prevState.current = Flip.getState(gridRef.current.querySelectorAll('[data-shop-card]'));
    }
  }

  const filterBtn = (active: boolean) =>
    cn(
      'px-4 py-2 font-mono text-micro uppercase tracking-[0.18em] border transition-colors',
      active
        ? 'bg-[var(--acid)] text-[var(--bg-void)] border-[var(--acid)]'
        : 'text-[var(--ink-mute)] border-[var(--stroke-strong)] hover:text-[var(--ink)] hover:border-[var(--ink)]',
    );

  return (
    <div
      className="pt-[16vh] pb-[14vh] bg-[var(--bg-void)] text-[var(--ink)] min-h-screen"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <header className="pb-8">
        <div className="grid grid-cols-12 gap-4 items-end">
          <p className="col-span-12 md:col-span-6 font-mono text-micro uppercase tracking-[0.18em] text-[var(--violet-glow)]">
            TIENDA · DROP 01 · MMXXVI
          </p>
          <h1 className="col-span-12 md:col-span-6 font-display text-display tracking-[-0.04em] leading-[0.9] uppercase text-right">
            EL DROP
          </h1>
        </div>
      </header>

      {/* Barra de filtros */}
      <div className="sticky top-[64px] z-20 -mx-[var(--grid-margin)] px-[var(--grid-margin)] py-4 bg-[var(--bg-void)]/85 backdrop-blur-md border-y border-[var(--stroke)] mb-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 justify-between">
          {/* Categorías */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  beforeChange();
                  setCategory(c);
                }}
                className={filterBtn(category === c)}
              >
                {c === 'all' ? 'TODO' : c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Disponibilidad */}
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
                    beforeChange();
                    setAvailability(v);
                  }}
                  className={filterBtn(availability === v)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Orden */}
            <select
              value={sort}
              onChange={(e) => {
                beforeChange();
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
        <p className="mt-3 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {visible.length} {visible.length === 1 ? 'OBJETO' : 'OBJETOS'}
        </p>
      </div>

      {/* Grid e-commerce regular */}
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
              className="group relative block bg-[var(--bg-asphalt)] overflow-hidden"
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
                {/* overlay hover con CTA */}
                <div className="absolute inset-0 bg-[var(--bg-void)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 grid place-items-center">
                  <span className="font-mono text-micro uppercase tracking-[0.18em] border border-[var(--acid)] text-[var(--acid)] px-5 py-2">
                    {sold ? 'AGOTADO' : 'VER PRENDA'}
                  </span>
                </div>
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
                  {categoryOf(p)} · ED. {p.edition}
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
