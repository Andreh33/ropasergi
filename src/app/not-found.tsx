'use client';
import { useAudio } from '@/components/providers/audio-context';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

export default function NotFound() {
  const [clicks, setClicks] = useState(0);
  const [tremor, setTremor] = useState(false);
  const audio = useAudio();

  function on404Click() {
    setClicks((c) => c + 1);
    setTremor(true);
    window.setTimeout(() => setTremor(false), 400);
    if (clicks + 1 === 8) audio.play('unlock');
  }

  return (
    <div
      className="min-h-[100dvh] bg-[var(--bg-void)] text-[var(--ink)] grid place-items-center overflow-hidden relative"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      {/* marquee diagonal */}
      <div
        aria-hidden
        className="absolute inset-0 grid place-items-center pointer-events-none"
        style={{ transform: 'rotate(-10deg)' }}
      >
        <div className="whitespace-nowrap font-mono text-micro uppercase tracking-[0.6em] text-[var(--ink-faint)] text-[clamp(0.9rem,1.4vw,1.2rem)]">
          {Array.from({ length: 14 })
            .map(() => 'RUTA NO EXISTE · ')
            .join('')}
        </div>
      </div>

      <div className="relative z-10 text-center space-y-10 max-w-2xl">
        <motion.button
          type="button"
          onClick={on404Click}
          animate={tremor ? { x: [0, -6, 6, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.35 }}
          data-cursor="button"
          className="font-display text-mega leading-[0.85] tracking-[-0.05em] text-[var(--ink)] block w-full"
          aria-label="404"
        >
          404
        </motion.button>

        <div className="border border-[var(--stroke-strong)] p-8 space-y-4">
          <p className="font-serif italic text-h3 text-[var(--ink)] leading-[1.35]">
            Esta página no está.
          </p>
          <p className="font-serif italic text-body text-[var(--ink-mute)]">
            Puede que nunca lo haya estado. Puede que la borráramos para que no la encontraras. No
            es lo mismo.
          </p>
        </div>

        <AnimatePresence>
          {clicks >= 4 && clicks < 8 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)]"
            >
              INSISTES.
            </motion.p>
          ) : null}
          {clicks >= 8 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)]">
                BIEN, AHÍ TIENES.
              </p>
              <code className="font-mono text-small text-[var(--ink)] border border-[var(--neon-azure)] px-3 py-1 inline-block">
                INSISTENTE10
              </code>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-4 justify-center font-mono text-micro uppercase tracking-[0.18em]">
          <Link
            href="/"
            data-cursor="link"
            className="px-6 py-3 border border-[var(--stroke-strong)] hover:bg-[var(--ink)] hover:text-[var(--bg-void)] transition-colors"
          >
            ← VOLVER AL UMBRAL
          </Link>
          <Link
            href="/tienda"
            data-cursor="link"
            className="px-6 py-3 border border-[var(--neon-azure)] text-[var(--neon-azure)] hover:bg-[var(--neon-azure)] hover:text-[var(--bg-void)] transition-colors"
          >
            VER LA TIENDA →
          </Link>
        </div>
      </div>
    </div>
  );
}
