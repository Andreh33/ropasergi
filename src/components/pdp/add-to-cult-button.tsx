'use client';
import { useAudio } from '@/components/providers/audio-context';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useCartStore } from '@/lib/store/cart';
import type { Product, Size } from '@/lib/types';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

type Props = {
  product: Product;
  selectedSize: Size | null;
  onMissingSize?: () => void;
};

export function AddToCultButton({ product, selectedSize, onMissingSize }: Props) {
  const add = useCartStore((s) => s.add);
  const open = useCartStore((s) => s.open);
  const audio = useAudio();
  const [phase, setPhase] = useState<'idle' | 'loading' | 'success'>('idle');

  if (product.status === 'soldout') {
    return (
      <div className="w-full text-center font-mono text-micro uppercase tracking-[0.18em] py-4 border border-[var(--blood)] text-[var(--blood)]">
        AGOTADO · EL CULTO ESTÁ LLENO
      </div>
    );
  }

  function onAdd() {
    if (!selectedSize) {
      onMissingSize?.();
      audio.play('error');
      return;
    }
    setPhase('loading');
    audio.play('add');
    // flash acid breve
    const flash = document.createElement('div');
    flash.style.cssText =
      'position:fixed;inset:0;background:var(--neon-azure);opacity:.35;z-index:9999;pointer-events:none;';
    document.body.appendChild(flash);
    window.setTimeout(() => flash.remove(), 120);

    window.setTimeout(() => {
      add({
        slug: product.slug,
        size: selectedSize,
        qty: 1,
        name: product.name,
        price: product.price.amount,
        image: product.images[0]?.src,
      });
      setPhase('success');
      window.setTimeout(() => {
        setPhase('idle');
        open();
      }, 800);
    }, 250);
  }

  let label = 'AÑADIR AL CULTO';
  if (phase === 'loading') label = 'INSCRIBIENDO...';
  if (phase === 'success') label = 'INSCRITO ✓';

  return (
    <MagneticButton
      type="button"
      variant="primary"
      onClick={onAdd}
      className="w-full justify-center"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </MagneticButton>
  );
}
