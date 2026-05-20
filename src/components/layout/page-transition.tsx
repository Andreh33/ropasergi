'use client';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const ROUTE_LABEL: Record<string, string> = {
  '/': 'VOLVER AL UMBRAL',
  '/drop': 'EL DROP',
  '/manifiesto': 'EL MANIFIESTO',
  '/leyenda': 'LEYENDA',
  '/pacto-firmado': 'PACTO FIRMADO',
};

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (pathname?.startsWith('/producto/')) {
      const slug = pathname.replace('/producto/', '').toUpperCase().replace(/-/g, ' ');
      setLabel(slug);
    } else {
      setLabel(ROUTE_LABEL[pathname ?? '/'] ?? '');
    }
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 900);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key={pathname}
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          animate={{ clipPath: 'inset(0 0 100% 0)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.18, 0, 0, 1] }}
          className="fixed inset-0 bg-[var(--bg-void)] grid place-items-center pointer-events-none"
          style={{ zIndex: 'var(--z-loader)' as unknown as number }}
        >
          <span className="font-display text-h2 tracking-[-0.04em] text-[var(--ink)] uppercase">
            {label}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
