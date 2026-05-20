'use client';
import { NeonTag } from '@/components/ui/neon-tag';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

function stockTag(p: Product) {
  if (p.status === 'soldout') return { label: 'AGOTADO', variant: 'blood' as const };
  const ratio = p.numbered.total > 0 ? p.numbered.available / p.numbered.total : 0;
  if (ratio >= 0.5) return { label: 'DISPONIBLE', variant: 'acid' as const };
  if (ratio >= 0.1) return { label: 'QUEDAN POCAS', variant: 'magenta' as const };
  return { label: `${p.numbered.available} DE ${p.numbered.total}`, variant: 'magenta' as const };
}

export function FeaturedDrop({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement | null>(null);
  const featured = products.slice(0, 6);

  useGSAP(
    () => {
      if (!root.current) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-fcard]', root.current);
      cards.forEach((card, i) => {
        gsap.from(card, {
          yPercent: 18,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'p1-out',
          delay: (i % 3) * 0.08,
          immediateRender: false,
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        });
      });
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root as React.RefObject<HTMLElement> },
  );

  return (
    <section
      ref={root}
      className="relative bg-[var(--bg-void)] py-[12vh] border-t border-[var(--stroke)]"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
      aria-label="Drop destacado"
    >
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div>
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--acid)] mb-3">
            DISPONIBLE AHORA · DROP 01
          </p>
          <h2 className="font-display text-h2 tracking-[-0.04em] leading-[0.9] uppercase">
            OCHO OBJETOS.
            <br />
            UNA SOLA VEZ.
          </h2>
        </div>
        <Link
          href="/drop"
          prefetch
          className="self-start md:self-end font-mono text-micro uppercase tracking-[0.18em] border border-[var(--stroke-strong)] px-6 py-3 hover:bg-[var(--acid)] hover:text-[var(--bg-void)] transition-colors"
        >
          VER TODO EL DROP →
        </Link>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {featured.map((p) => {
          const tag = stockTag(p);
          const first = p.images[0];
          const sold = p.status === 'soldout';
          return (
            <Link
              key={p.slug}
              href={sold ? '#' : `/producto/${p.slug}`}
              data-fcard
              prefetch={!sold}
              aria-disabled={sold}
              className="group relative block overflow-hidden bg-[var(--bg-asphalt)] aspect-[4/5]"
            >
              <div className="absolute top-3 left-3 z-10">
                <NeonTag variant={tag.variant}>{tag.label}</NeonTag>
              </div>
              {first ? (
                <Image
                  src={first.src}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(.18,0,0,1)] group-hover:scale-[1.05]"
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 border-t border-[var(--stroke-strong)] backdrop-blur-sm bg-[var(--bg-void)]/45 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-h3 tracking-[-0.02em] leading-[1] truncate">
                    {p.name}
                  </h3>
                  <span className="font-mono text-small text-[var(--ink)] shrink-0">
                    {formatPrice(p.price.amount)}
                  </span>
                </div>
                <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] mt-1">
                  ED. {p.edition}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
