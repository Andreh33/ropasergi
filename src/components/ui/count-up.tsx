'use client';
import { animate, useInView, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';

type Props = {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
};

export function CountUp({ value, duration = 1.2, format, className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (n) =>
    format ? format(Math.round(n)) : Math.round(n).toString(),
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration, ease: [0.18, 0, 0, 1] });
    return () => controls.stop();
  }, [inView, value, duration, mv]);

  useEffect(() => {
    return rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = v;
    });
  }, [rounded]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {format ? format(0) : '0'}
    </span>
  );
}
