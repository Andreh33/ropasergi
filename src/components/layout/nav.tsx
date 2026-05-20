'use client';
import { useCartStore } from '@/lib/store/cart';
import { cn } from '@/lib/utils';
import { Search, ShoppingBag } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MuteToggle } from './mute-toggle';

const ITEMS = [
  { href: '/manifiesto', label: 'MANIFIESTO' },
  { href: '/drop', label: 'DROP' },
  { href: '/#culto', label: 'CULTO' },
];

export function Nav({ onOpenCmdK }: { onOpenCmdK: () => void }) {
  const pathname = usePathname();
  const isPDP = pathname?.startsWith('/producto/') ?? false;
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const count = items.reduce((a, i) => a + i.qty, 0);
  const [cartFlash, setCartFlash] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 80);
    const delta = latest - lastY.current;
    const velocity = Math.abs(delta);
    if (delta > 6 && latest > 220) setHidden(true);
    else if (delta < -2 && velocity > 2) setHidden(false);
    lastY.current = latest;
  });

  // Bounce de cart badge cuando count cambia
  const prevCount = useRef(count);
  useEffect(() => {
    if (count !== prevCount.current) {
      setCartFlash(true);
      const t = setTimeout(() => setCartFlash(false), 400);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <motion.nav
      initial={false}
      animate={{
        height: scrolled ? 56 : 96,
        y: hidden ? -100 : 0,
        backgroundColor: scrolled || isPDP ? 'rgba(6,6,6,0.65)' : 'rgba(6,6,6,0)',
        backdropFilter: scrolled || isPDP ? 'blur(12px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.5, ease: [0.18, 0, 0, 1] }}
      className="fixed top-0 left-0 right-0"
      style={{
        zIndex: 'var(--z-nav)' as unknown as number,
        paddingTop: 'max(0px, var(--safe-top))',
      }}
    >
      <div
        className="h-full flex items-center justify-between"
        style={{
          paddingLeft: 'var(--grid-margin)',
          paddingRight: 'var(--grid-margin)',
        }}
      >
        <Link
          href="/"
          data-cursor="link"
          data-cursor-label="HOME"
          className="font-display text-[clamp(1rem,1.25vw,1.25rem)] tracking-[-0.04em] uppercase"
        >
          PROYECTO 1
        </Link>

        <ul className="hidden md:flex gap-8 items-center font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {ITEMS.map((it) => {
            const active =
              pathname === it.href || (it.href === '/drop' && pathname?.startsWith('/drop'));
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  data-cursor="link"
                  data-cursor-label={it.label}
                  prefetch
                  className={cn(
                    'relative py-1 transition-colors hover:text-[var(--ink)]',
                    active && 'text-[var(--ink)]',
                  )}
                >
                  {it.label}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute left-0 right-0 -bottom-0.5 h-[1px] origin-left scale-x-0 transition-transform duration-300',
                      'bg-[var(--acid)]',
                      active && 'scale-x-100',
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCmdK}
            data-cursor="button"
            aria-label="Buscar"
            className="grid place-items-center w-9 h-9 text-[var(--ink)] hover:text-[var(--acid)] transition-colors"
          >
            <Search size={18} />
          </button>
          <MuteToggle />
          <button
            type="button"
            onClick={openCart}
            data-cursor="button"
            aria-label={count > 0 ? `Carro (${count})` : 'Carro vacío'}
            className="relative grid place-items-center w-9 h-9 text-[var(--ink)] hover:text-[var(--acid)] transition-colors"
          >
            <ShoppingBag size={18} />
            {count > 0 ? (
              <motion.span
                key={count}
                animate={cartFlash ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center font-mono text-[10px] bg-[var(--acid)] text-[var(--bg-void)]"
              >
                {count}
              </motion.span>
            ) : null}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
