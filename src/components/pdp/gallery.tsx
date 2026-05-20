'use client';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

/**
 * Galería simple de la PDP: imagen principal + tira de miniaturas. Sin 3D.
 * Las fotos son las que se suben desde /admin (product.images).
 */
export function Gallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const [idx, setIdx] = useState(0);
  const active = images[Math.min(idx, Math.max(images.length - 1, 0))];

  return (
    <div className="relative w-full h-[58vh] md:h-[100dvh] bg-[var(--bg-void)] flex">
      {/* Miniaturas */}
      {images.length > 1 ? (
        <div className="flex md:flex-col gap-2 p-3 md:py-[14vh] md:px-3 overflow-auto shrink-0">
          {images.map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === idx}
              data-cursor="button"
              className={cn(
                'relative w-14 h-[72px] md:w-16 md:h-20 shrink-0 overflow-hidden border transition-colors',
                i === idx
                  ? 'border-[var(--neon-azure)]'
                  : 'border-[var(--stroke)] hover:border-[var(--ink)]',
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Imagen principal */}
      <div className="relative flex-1 grid place-items-center p-4 md:p-[6vh] overflow-hidden">
        {active ? (
          <Image
            key={active.src}
            src={active.src}
            alt={active.alt || product.name}
            width={1000}
            height={1250}
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-contain max-h-full w-auto animate-[pdpFade_.45s_cubic-bezier(.18,0,0,1)] drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          />
        ) : (
          <span className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
            Sin fotos todavía
          </span>
        )}

        {/* Edición / referencia */}
        <div className="absolute top-4 left-4 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {product.edition}
        </div>

        {/* Contador */}
        {images.length > 0 ? (
          <div className="absolute bottom-4 right-4 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
            {String(idx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        ) : null}
      </div>
    </div>
  );
}
