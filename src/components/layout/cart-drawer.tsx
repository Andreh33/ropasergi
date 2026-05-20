'use client';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const close = useCartStore((s) => s.close);
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);
  const total = useCartStore((s) => s.total());
  const count = items.reduce((a, i) => a + i.qty, 0);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
            className="fixed inset-0 bg-black"
            style={{ zIndex: 'var(--z-drawer)' as unknown as number }}
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.18, 0, 0, 1] }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-[var(--bg-tarmac)] text-[var(--ink)] flex flex-col"
            style={{
              zIndex: 'calc(var(--z-drawer) + 1)' as unknown as number,
              paddingTop: 'var(--safe-top)',
              paddingBottom: 'var(--safe-bottom)',
            }}
            aria-label="Carrito"
          >
            <header className="flex items-center justify-between p-6 border-b border-[var(--stroke)]">
              <h2 className="font-display text-h3 tracking-[-0.03em]">EL CULTO ESPERA</h2>
              <button
                type="button"
                onClick={close}
                data-cursor="button"
                aria-label="Cerrar carrito"
                className="w-11 h-11 grid place-items-center"
              >
                <X size={20} />
              </button>
            </header>

            <p className="px-6 py-4 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] border-b border-[var(--stroke)]">
              {count} OBJETOS · TOTAL {formatPrice(total)}
            </p>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-8 text-center space-y-4">
                  <p className="font-serif italic text-h3 text-[var(--ink)]">
                    Aún no has elegido nada.
                  </p>
                  <Link
                    href="/drop"
                    data-cursor="link"
                    onClick={close}
                    className="inline-block font-mono text-micro uppercase tracking-[0.18em] text-[var(--acid)]"
                  >
                    VER EL DROP →
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--stroke)]">
                  {items.map((item) => {
                    return (
                      <li key={`${item.slug}-${item.size}`} className="p-6 flex gap-4">
                        <div className="relative w-20 aspect-[4/5] bg-[var(--bg-asphalt)] shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-display text-h3 tracking-[-0.02em] leading-[0.95]">
                            {item.name}
                          </h3>
                          <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
                            TALLA {item.size} · {formatPrice(item.price)}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-mono text-micro">
                              <button
                                type="button"
                                onClick={() => updateQty(item.slug, item.size, item.qty - 1)}
                                data-cursor="button"
                                className="w-8 h-8 grid place-items-center border border-[var(--stroke-strong)]"
                                aria-label="Reducir cantidad"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="min-w-[2ch] text-center">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.slug, item.size, item.qty + 1)}
                                data-cursor="button"
                                className="w-8 h-8 grid place-items-center border border-[var(--stroke-strong)]"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(item.slug, item.size)}
                              data-cursor="link"
                              className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] hover:text-[var(--blood)] transition-colors"
                            >
                              QUITAR
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t border-[var(--stroke)] p-6 space-y-3">
              <div className="flex justify-between font-mono text-small uppercase tracking-[0.12em] text-[var(--ink-mute)]">
                <span>SUBTOTAL</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-mono text-small uppercase tracking-[0.12em] text-[var(--ink-mute)]">
                <span>ENVÍO</span>
                <span>INCLUIDO</span>
              </div>
              <div className="flex justify-between font-mono text-h3 tracking-[-0.02em] text-[var(--ink)]">
                <span>TOTAL</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link href="/pacto-firmado" onClick={close} className="block mt-4">
                <MagneticButton variant="primary" className="w-full justify-center">
                  CERRAR EL PACTO
                </MagneticButton>
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
