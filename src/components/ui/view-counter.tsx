'use client';
import { randomInt } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function ViewCounter({ min = 38, max = 67 }: { min?: number; max?: number }) {
  const [n, setN] = useState<number>(min + Math.floor((max - min) / 2));

  useEffect(() => {
    let mounted = true;
    function loop() {
      if (!mounted) return;
      setN(randomInt(min, max));
      const next = randomInt(4000, 9000);
      window.setTimeout(loop, next);
    }
    const initial = window.setTimeout(loop, 1500);
    return () => {
      mounted = false;
      window.clearTimeout(initial);
    };
  }, [min, max]);

  return (
    <span
      className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)]"
      suppressHydrationWarning
    >
      VIENDO AHORA · {n}
    </span>
  );
}
