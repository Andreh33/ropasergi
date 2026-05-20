'use client';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

type Props = {
  text: string;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
  repeat?: number;
};

export function Marquee({ text, className, speed = 30, direction = 'left', repeat = 8 }: Props) {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const inner = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!inner.current) return;
      const distance = inner.current.scrollWidth / 2;
      const fromX = direction === 'left' ? 0 : -distance;
      const toX = direction === 'left' ? -distance : 0;
      gsap.set(inner.current, { x: fromX });
      gsap.to(inner.current, {
        x: toX,
        duration: distance / speed,
        ease: 'none',
        repeat: -1,
      });
    },
    { scope: wrapper },
  );

  const repeats = Array.from({ length: repeat });

  return (
    <div ref={wrapper} className={cn('overflow-hidden whitespace-nowrap', className)}>
      <div ref={inner} className="inline-flex">
        {repeats.map((_, i) => (
          <span key={i} className="px-6 inline-block">
            {text}
          </span>
        ))}
        {repeats.map((_, i) => (
          <span key={`b-${i}`} className="px-6 inline-block" aria-hidden>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
