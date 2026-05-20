export default function Loading() {
  return (
    <div className="min-h-[100dvh] grid place-items-center bg-[var(--bg-void)]">
      <div className="text-center space-y-4">
        <p className="font-display text-h2 tracking-[-0.04em] text-[var(--ink)] uppercase animate-pulse">
          PROYECTO 1
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          CARGANDO...
        </p>
      </div>
    </div>
  );
}
