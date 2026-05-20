'use client';
import { useAudio } from '@/components/providers/audio-context';
import type { Size } from '@/lib/types';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export type SizePickerHandle = {
  shake: () => void;
};

type Props = {
  sizes: Size[];
  soldout?: Size[];
  value: Size | null;
  onChange: (s: Size) => void;
};

export const SizePicker = forwardRef<SizePickerHandle, Props>(function SizePicker(
  { sizes, soldout = [], value, onChange },
  ref,
) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const audio = useAudio();

  useImperativeHandle(ref, () => ({
    shake() {
      if (!rowRef.current) return;
      gsap.fromTo(
        rowRef.current,
        { x: 0 },
        { keyframes: { x: [0, -8, 8, -4, 4, 0] }, duration: 0.45, ease: 'power2.out' },
      );
    },
  }));

  return (
    <div className="space-y-3">
      <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
        TALLA
      </p>
      <div ref={rowRef} className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const isSold = soldout.includes(s);
          const isActive = value === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (isSold) return;
                onChange(s);
                audio.play('tick');
              }}
              aria-pressed={isActive}
              aria-label={`Talla ${s}${isSold ? ' agotada' : ''}`}
              disabled={isSold}
              className={cn(
                'min-w-12 h-10 px-3 grid place-items-center font-mono text-micro uppercase tracking-[0.18em] border transition-all',
                isActive
                  ? 'bg-[var(--neon-azure)] text-[var(--bg-void)] border-[var(--neon-azure)]'
                  : 'text-[var(--ink)] border-[var(--stroke-strong)]',
                isSold && 'opacity-40 line-through cursor-not-allowed',
                !isActive && value !== null && 'opacity-50',
              )}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
});
