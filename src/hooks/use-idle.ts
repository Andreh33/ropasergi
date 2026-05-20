'use client';
import { useEffect, useState } from 'react';

export function useIdle(timeout = 30000) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let t: number | null = null;
    const reset = () => {
      if (idle) setIdle(false);
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => setIdle(true), timeout);
    };
    reset();
    const evts: Array<keyof WindowEventMap> = ['pointermove', 'keydown', 'wheel', 'touchstart'];
    evts.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      if (t) window.clearTimeout(t);
      evts.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [idle, timeout]);

  return idle;
}
