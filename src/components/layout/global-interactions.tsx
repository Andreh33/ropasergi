'use client';
import { useKonami } from '@/hooks/use-konami';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function GlobalInteractions() {
  const [rawMode, setRawMode] = useState(false);

  useKonami(() => {
    setRawMode(true);
    gsap.globalTimeline.timeScale(0.3);
    window.setTimeout(() => {
      setRawMode(false);
      gsap.globalTimeline.timeScale(1);
    }, 8000);
  });

  return (
    <AnimatePresence>
      {rawMode ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0"
          style={{ zIndex: 'var(--z-toast)' as unknown as number }}
        >
          {/* grid overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(to right, var(--neon-azure) 1px, transparent 1px), linear-gradient(to bottom, var(--neon-azure) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          {/* dev bar */}
          <div className="absolute top-0 left-0 right-0 px-4 py-2 flex justify-between font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)] bg-[var(--bg-void)] border-b border-[var(--neon-azure)]">
            <span>MODO RAW</span>
            <RawStats />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)] bg-[var(--bg-void)] border border-[var(--neon-azure)] px-4 py-2">
            MODO RAW ACTIVADO · ESTÁS VIENDO LO QUE NOSOTROS VEMOS
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function RawStats() {
  const [stats, setStats] = useState({ vw: 0, vh: 0, fps: 0 });
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    const loop = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setStats({ vw: window.innerWidth, vh: window.innerHeight, fps: frames });
        frames = 0;
        last = now;
      }
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);
  return (
    <span>
      {stats.vw}×{stats.vh} · {stats.fps} FPS
    </span>
  );
}
