'use client';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { AdminLogin } from './admin-login';
import { ProductForm } from './product-form';

type View = 'loading' | 'login' | 'dashboard';

export function AdminDashboard() {
  const [view, setView] = useState<View>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [backend, setBackend] = useState<'blob' | 'filesystem'>('filesystem');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/products', { cache: 'no-store' });
    if (res.status === 401) {
      setView('login');
      return;
    }
    const data = await res.json();
    setProducts(data.products ?? []);
    setBackend(data.backend ?? 'filesystem');
    setView('dashboard');
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDelete(slug: string) {
    if (!confirm(`¿Eliminar "${slug}"? No se puede deshacer.`)) return;
    const res = await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products ?? []);
    }
  }

  async function onLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setView('login');
  }

  if (view === 'loading') {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--bg-void)]">
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          CARGANDO PANEL...
        </p>
      </div>
    );
  }

  if (view === 'login') {
    return <AdminLogin onSuccess={load} />;
  }

  return (
    <div
      className="min-h-screen bg-[var(--bg-void)] text-[var(--ink)] py-12"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <header className="flex items-end justify-between border-b border-[var(--stroke)] pb-6 mb-8">
        <div>
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)]">
            PANEL DE GESTIÓN
          </p>
          <h1 className="font-display text-h2 tracking-[-0.04em] uppercase">PROYECTO 1 · ADMIN</h1>
          <p className="mt-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
            {products.length} PRODUCTOS · ALMACENAMIENTO:{' '}
            <span
              className={
                backend === 'blob' ? 'text-[var(--neon-azure)]' : 'text-[var(--neon-blood)]'
              }
            >
              {backend === 'blob' ? 'VERCEL BLOB' : 'LOCAL (DEV)'}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-[var(--neon-azure)] text-[var(--bg-void)] font-mono text-micro uppercase tracking-[0.18em]"
          >
            + NUEVO PRODUCTO
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-6 py-3 border border-[var(--stroke-strong)] font-mono text-micro uppercase tracking-[0.18em] hover:bg-[var(--bg-tarmac)]"
          >
            SALIR
          </button>
        </div>
      </header>

      {showForm ? (
        <ProductForm
          initial={editing}
          onCancel={() => setShowForm(false)}
          onSaved={(list) => {
            setProducts(list);
            setShowForm(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.slug}
              className="border border-[var(--stroke)] bg-[var(--bg-asphalt)] overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-[var(--bg-tarmac)]">
                {p.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0].src} alt={p.name} className="w-full h-full object-cover" />
                ) : null}
                {p.status === 'soldout' ? (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-[var(--blood)] text-[var(--ink)] font-mono text-[10px] uppercase tracking-[0.18em]">
                    AGOTADO
                  </span>
                ) : null}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-display text-h3 tracking-[-0.02em] leading-[1]">{p.name}</h3>
                <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
                  ED. {p.edition} · {formatPrice(p.price.amount)} · {p.numbered.available}/
                  {p.numbered.total}
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-azure)] hover:underline"
                  >
                    EDITAR
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.slug)}
                    className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] hover:text-[var(--blood)]"
                  >
                    BORRAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
