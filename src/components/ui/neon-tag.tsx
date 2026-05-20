import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  variant?: 'acid' | 'magenta' | 'blood' | 'outline';
  className?: string;
};

const GLOW: Record<string, string> = {
  acid: '0 0 12px rgba(204,255,0,0.55)',
  magenta: '0 0 12px rgba(255,31,106,0.55)',
  blood: '0 0 10px rgba(200,31,31,0.5)',
  outline: 'none',
};

export function NeonTag({ children, variant = 'acid', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 font-mono text-micro uppercase tracking-[0.18em] border',
        variant === 'acid' &&
          'bg-[var(--neon-azure)] text-[var(--bg-void)] border-[var(--neon-azure)]',
        variant === 'magenta' &&
          'bg-[var(--neon-blood)] text-[var(--ink)] border-[var(--neon-blood)]',
        variant === 'blood' && 'bg-[var(--blood)] text-[var(--ink)] border-[var(--blood)]',
        variant === 'outline' && 'bg-transparent text-[var(--ink)] border-[var(--stroke-strong)]',
        className,
      )}
      style={{ borderRadius: 'var(--r-1)', boxShadow: GLOW[variant] }}
    >
      {children}
    </span>
  );
}
