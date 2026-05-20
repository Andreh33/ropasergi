'use client';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Easter egg: triple-click sobre cualquier "PROYECTO 1" del nav/footer.
 * Detecta clicks con data-logo y los rompe / recompone.
 */
export function LogoTripleClick() {
  const [toast, setToast] = useState(false);
  const clicks = useRef<number[]>([]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const logo = t.closest<HTMLElement>('[data-logo]') ?? t.closest<HTMLElement>('a[href="/"]');
      if (!logo) return;
      const now = performance.now();
      clicks.current = [...clicks.current.filter((c) => now - c < 600), now];
      if (clicks.current.length >= 3) {
        clicks.current = [];
        explode(logo);
        setToast(true);
        window.setTimeout(() => setToast(false), 1800);
      }
    }
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  function explode(logo: HTMLElement) {
    try {
      const split = new SplitText(logo, { type: 'chars' });
      const chars = split.chars;
      gsap.to(chars, {
        x: () => (Math.random() - 0.5) * 200,
        y: () => (Math.random() - 0.5) * 80,
        rotation: () => (Math.random() - 0.5) * 40,
        duration: 0.4,
        ease: 'p1-out',
        onComplete: () => {
          gsap.to(chars, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)',
            onComplete: () => split.revert(),
          });
        },
      });
    } catch {
      /* sin SplitText, no rompe */
    }
  }

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-6 right-6 font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)] bg-[var(--bg-void)] border border-[var(--neon-azure)] px-4 py-2"
          style={{ zIndex: 'var(--z-toast)' as unknown as number }}
        >
          BIEN HECHO. AHORA SIGUE BAJANDO.
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
