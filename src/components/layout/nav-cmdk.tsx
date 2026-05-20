'use client';
import { PRODUCTS } from '@/lib/data/products';
import { useAudioStore } from '@/lib/store/audio';
import { useCartStore } from '@/lib/store/cart';
import type { Product } from '@/lib/types';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = { open: boolean; onOpenChange: (o: boolean) => void };

export function NavCmdK({ open, onOpenChange }: Props) {
  const router = useRouter();
  const openCart = useCartStore((s) => s.open);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const muted = useAudioStore((s) => s.muted);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  // Cargar el catálogo dinámico (incluye productos añadidos en /admin)
  useEffect(() => {
    if (!open) return;
    fetch('/api/catalog', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.products) && d.products.length > 0) setProducts(d.products);
      })
      .catch(() => {});
  }, [open]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 backdrop-blur-md"
          style={{
            zIndex: 'var(--z-cmdk)' as unknown as number,
            backgroundColor: 'rgba(5,5,7,0.85)',
          }}
        >
          <motion.div
            initial={{ clipPath: 'inset(50% 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0)', opacity: 1 }}
            exit={{ clipPath: 'inset(50% 0)', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.18, 0, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,92vw)] border border-[var(--stroke-strong)] bg-[var(--bg-void)]"
          >
            <Command label="Paleta de comandos" className="text-[var(--ink)]">
              <Command.Input
                placeholder="BUSCAR LA TIENDA, EL MANIFIESTO O EL CULTO..."
                className="w-full px-5 py-5 bg-transparent border-b border-[var(--stroke)] font-mono text-micro uppercase tracking-[0.18em] placeholder:text-[var(--ink-mute)]"
              />
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                <Command.Empty className="px-4 py-6 font-serif italic text-h3 text-[var(--ink-mute)]">
                  Nada. Prueba con: chándal, reloj, manifiesto, Tarragona.
                </Command.Empty>

                <Command.Group
                  heading="IR A"
                  className="px-2 py-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]"
                >
                  {[
                    { label: 'Manifiesto', href: '/manifiesto' },
                    { label: 'Tienda', href: '/tienda' },
                    { label: 'El culto', href: '/#culto' },
                    { label: 'Leyenda', href: '/leyenda' },
                  ].map((it) => (
                    <Command.Item
                      key={it.href}
                      onSelect={() => go(it.href)}
                      className="px-3 py-2 cursor-pointer font-display text-h3 tracking-[-0.02em] text-[var(--ink)] data-[selected=true]:bg-[var(--neon-azure)] data-[selected=true]:text-[var(--bg-void)]"
                    >
                      {it.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="PRENDAS"
                  className="px-2 py-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]"
                >
                  {products.map((p) => (
                    <Command.Item
                      key={p.slug}
                      onSelect={() => go(`/producto/${p.slug}`)}
                      className="px-3 py-2 cursor-pointer font-display text-h3 tracking-[-0.02em] text-[var(--ink)] data-[selected=true]:bg-[var(--neon-azure)] data-[selected=true]:text-[var(--bg-void)]"
                    >
                      {p.name}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="ACCIONES"
                  className="px-2 py-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]"
                >
                  <Command.Item
                    onSelect={() => {
                      toggleMute();
                      onOpenChange(false);
                    }}
                    className="px-3 py-2 cursor-pointer font-display text-h3 text-[var(--ink)] data-[selected=true]:bg-[var(--neon-azure)] data-[selected=true]:text-[var(--bg-void)]"
                  >
                    {muted ? 'Activar sonido' : 'Silenciar sonido'}
                  </Command.Item>
                  <Command.Item
                    onSelect={() => {
                      openCart();
                      onOpenChange(false);
                    }}
                    className="px-3 py-2 cursor-pointer font-display text-h3 text-[var(--ink)] data-[selected=true]:bg-[var(--neon-azure)] data-[selected=true]:text-[var(--bg-void)]"
                  >
                    Abrir el carro
                  </Command.Item>
                  <Command.Item
                    onSelect={() => go('/')}
                    className="px-3 py-2 cursor-pointer font-display text-h3 text-[var(--ink)] data-[selected=true]:bg-[var(--neon-azure)] data-[selected=true]:text-[var(--bg-void)]"
                  >
                    Volver al inicio
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="border-t border-[var(--stroke)] px-4 py-3 flex justify-between text-[var(--ink-mute)] font-mono text-micro uppercase tracking-[0.18em]">
                <span>↑ ↓ navegar</span>
                <span>↵ seleccionar</span>
                <span>esc cerrar</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
