'use client';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'span';
  delay?: number;
  duration?: number;
  start?: string;
  fromClip?: string;
  toClip?: string;
  y?: number;
  yPercent?: number;
};

export function Reveal({
  children,
  className,
  as = 'div',
  delay = 0,
  duration = 0.9,
  start = 'top 85%',
  fromClip = 'inset(0 0 100% 0)',
  toClip = 'inset(0 0 0% 0)',
  y,
  yPercent,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const Tag = as as 'div';

  useGSAP(
    () => {
      if (!ref.current) return;
      const from: gsap.TweenVars = { clipPath: fromClip };
      const to: gsap.TweenVars = {
        clipPath: toClip,
        duration,
        delay,
        ease: 'p1-out',
        scrollTrigger: { trigger: ref.current, start, toggleActions: 'play none none none' },
      };
      if (typeof yPercent === 'number') {
        from.yPercent = yPercent;
        to.yPercent = 0;
      }
      if (typeof y === 'number') {
        from.y = y;
        to.y = 0;
      }
      gsap.fromTo(ref.current, from, to);
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)} style={{ willChange: 'clip-path, transform' }}>
      {children}
    </Tag>
  );
}
