'use client';
import type { Product } from '@/lib/types';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';

export function ViewerFallback({ product }: { product: Product }) {
  const root = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 20 });
  const sy = useSpring(my, { stiffness: 90, damping: 20 });
  const tx = useTransform(sx, (v) => v * 12);
  const ty = useTransform(sy, (v) => v * 12);
  const rx = useTransform(sy, (v) => -v * 4);
  const ry = useTransform(sx, (v) => v * 4);
  const first = product.images[0];

  return (
    <div
      ref={root}
      onPointerMove={(e) => {
        const rect = root.current?.getBoundingClientRect();
        if (!rect) return;
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative w-full h-[100dvh] md:h-full bg-[var(--bg-void)] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 grid place-items-center"
        style={{ x: tx, y: ty, rotateX: rx, rotateY: ry, perspective: 1200 }}
      >
        {first ? (
          <Image
            src={first.src}
            alt={product.name}
            width={900}
            height={1200}
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] max-h-[80vh] w-auto"
          />
        ) : null}
      </motion.div>

      <div className="absolute bottom-6 left-6 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
        EXPERIENCIA REDUCIDA · 2D
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-display tracking-[-0.04em] text-[var(--ink)] mix-blend-difference">
        {product.edition}
      </div>
    </div>
  );
}
