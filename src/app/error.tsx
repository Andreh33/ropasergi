'use client';
import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-void)] grid place-items-center px-6">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="font-display text-mega tracking-[-0.05em] uppercase text-[var(--ink)]">
          ERROR
        </h1>
        <p className="font-serif italic text-h3 text-[var(--ink)]">
          Se nos ha salido algo de control. Estamos en ello.
        </p>
        {error.digest ? (
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
            {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="px-8 py-4 border border-[var(--stroke-strong)] font-mono text-micro uppercase tracking-[0.18em] hover:bg-[var(--acid)] hover:text-[var(--bg-void)] transition-colors"
        >
          REINTENTAR
        </button>
      </div>
    </div>
  );
}
