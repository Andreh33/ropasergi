import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  variant?: 'acid' | 'magenta' | 'blood' | 'outline';
  className?: string;
};

export function NeonTag({ children, variant = 'acid', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 font-mono text-micro uppercase tracking-[0.18em] border',
        variant === 'acid' && 'bg-[var(--acid)] text-[var(--bg-void)] border-[var(--acid)]',
        variant === 'magenta' && 'bg-[var(--magenta)] text-[var(--ink)] border-[var(--magenta)]',
        variant === 'blood' && 'bg-[var(--blood)] text-[var(--ink)] border-[var(--blood)]',
        variant === 'outline' && 'bg-transparent text-[var(--ink)] border-[var(--stroke-strong)]',
        'rounded-r1',
        className,
      )}
      style={{ borderRadius: 'var(--r-1)' }}
    >
      {children}
    </span>
  );
}
