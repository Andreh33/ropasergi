'use client';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section
      className="py-[18vh] bg-[var(--bg-void)] border-t border-[var(--stroke)]"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <h2 className="text-center font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] mb-12">
        LO QUE SE COMPRA CON ESTO
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {products.map((p) => (
          <RelatedCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const hover = useMotionValue(0);
  const sHover = useSpring(hover, { stiffness: 180, damping: 22 });
  const scale = useTransform(sHover, (v) => 1 - v * 0.4);
  const nameScale = useTransform(sHover, (v) => 1 + v * 0.18);
  const first = product.images[0];

  return (
    <Link
      ref={ref}
      href={`/producto/${product.slug}`}
      data-cursor="image"
      data-cursor-label="VIEW"
      prefetch
      onPointerEnter={() => hover.set(1)}
      onPointerLeave={() => hover.set(0)}
      className="block relative aspect-[4/5] overflow-hidden bg-[var(--bg-asphalt)] group"
    >
      {first ? (
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Image src={first.src} alt={product.name} fill sizes="33vw" className="object-cover" />
        </motion.div>
      ) : null}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <motion.h3
          style={{ scale: nameScale }}
          className="font-display text-h3 tracking-[-0.02em] text-[var(--ink)] mix-blend-difference text-center px-6"
        >
          {product.name}
        </motion.h3>
      </div>
      <div className="absolute left-0 right-0 bottom-0 border-t border-[var(--stroke-strong)] backdrop-blur-sm bg-[var(--bg-void)]/30 px-4 py-3 flex justify-between font-mono text-micro uppercase tracking-[0.18em]">
        <span className="text-[var(--ink-mute)]">ED. {product.edition}</span>
        <span className="text-[var(--ink)]">{formatPrice(product.price.amount)}</span>
      </div>
    </Link>
  );
}
