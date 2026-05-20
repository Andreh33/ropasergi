'use client';
import { useState } from 'react';

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      onSuccess();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Acceso denegado.');
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[var(--bg-void)] text-[var(--ink)] px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--acid)]">
            ACCESO RESTRINGIDO
          </p>
          <h1 className="font-display text-h2 tracking-[-0.04em] uppercase">PANEL · PROYECTO 1</h1>
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="CONTRASEÑA"
            autoFocus
            className="w-full px-4 py-4 bg-transparent border border-[var(--stroke-strong)] font-mono text-small uppercase tracking-[0.18em] text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:border-[var(--acid)]"
          />
          {error ? (
            <p className="mt-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--blood)]">
              {error}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[var(--acid)] text-[var(--bg-void)] font-mono text-micro uppercase tracking-[0.18em] disabled:opacity-50"
        >
          {loading ? 'COMPROBANDO...' : 'ENTRAR'}
        </button>
      </form>
    </div>
  );
}
