'use client';
import { useAudio } from '@/components/providers/audio-context';
import { Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

export function MuteToggle() {
  const { muted, toggleMute, hasConsented } = useAudio();
  const [showToast, setShowToast] = useState(false);

  function handleClick() {
    toggleMute();
    if (muted) {
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 1500);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        data-cursor="button"
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
        className="relative grid place-items-center w-9 h-9 text-[var(--ink)] hover:text-[var(--neon-azure)] transition-colors"
      >
        <AnimatePresence mode="wait">
          {muted ? (
            <motion.span
              key="mute"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="grid place-items-center"
            >
              <VolumeX size={18} />
            </motion.span>
          ) : (
            <motion.span
              key="on"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="grid place-items-center"
            >
              <Volume2 size={18} />
            </motion.span>
          )}
        </AnimatePresence>
        {!hasConsented && muted ? (
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 6 }}
            className="absolute inset-0 rounded-full border border-[var(--neon-azure)] opacity-40 pointer-events-none"
            aria-hidden
          />
        ) : null}
      </button>
      <AnimatePresence>
        {showToast ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-6 z-[var(--z-toast)] font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)] bg-[var(--bg-void)] border border-[var(--stroke-strong)] px-4 py-2"
            style={{ zIndex: 'var(--z-toast)' as unknown as number }}
          >
            SONIDO ACTIVADO
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
