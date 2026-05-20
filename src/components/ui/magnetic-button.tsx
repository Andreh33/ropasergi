'use client';
import { useAudio } from '@/components/providers/audio-context';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { type ButtonHTMLAttributes, type ReactNode, useRef } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  strength?: number;
  className?: string;
  variant?: 'primary' | 'secondary';
};

export function MagneticButton({
  children,
  strength = 0.35,
  className,
  variant = 'primary',
  onMouseEnter,
  onClick,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const audio = useAudio();

  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  function handleEnter(e: React.MouseEvent<HTMLButtonElement>) {
    audio.play('tick');
    onMouseEnter?.(e);
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    audio.play('tap');
    onClick?.(e);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={handleEnter}
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      style={{ x: sx, y: sy }}
      data-cursor="button"
      className={cn(
        'relative inline-flex items-center justify-center px-8 py-4 font-mono text-micro uppercase tracking-[0.18em] overflow-hidden select-none',
        variant === 'primary'
          ? 'border border-[var(--stroke-ink)] text-[var(--ink)] bg-transparent'
          : 'text-[var(--ink-mute)] border-b border-[var(--stroke-strong)]',
        className,
      )}
      {...(rest as Record<string, unknown>)}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' ? (
        <span
          className="absolute inset-0 bg-[var(--neon-azure)] pointer-events-none"
          style={{
            clipPath: 'inset(100% 0 0 0)',
            transition: 'clip-path .5s cubic-bezier(.18,0,0,1)',
          }}
          aria-hidden
          data-overlay
        />
      ) : null}
      <style jsx>{`
        button:hover [data-overlay] {
          clip-path: inset(0 0 0 0) !important;
        }
        button:hover {
          color: var(--bg-void);
        }
      `}</style>
    </motion.button>
  );
}
