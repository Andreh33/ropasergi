'use client';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';

const COMMUNITY = [
  {
    name: 'NUR',
    city: 'Sevilla',
    quote: 'No tiene logo. Por eso lo elegí.',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=80',
  },
  {
    name: 'JONAS',
    city: 'Berlín',
    quote: 'La capucha se acuerda de dónde la has llevado.',
    image: 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?w=900&q=80',
  },
  {
    name: 'CARMEN',
    city: 'Barcelona',
    quote: 'Esperé seis meses. No me arrepiento.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
  },
  {
    name: 'ALI',
    city: 'Tánger',
    quote: 'Si la prenda discute, mejor.',
    image: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=900&q=80',
  },
];

export function WhoWearsIt() {
  return (
    <section
      className="py-[18vh] bg-[var(--bg-void)] border-t border-[var(--stroke)]"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <h2 className="font-display text-display tracking-[-0.04em] leading-[0.9] uppercase text-[var(--ink)] mb-12">
        QUIÉN LO LLEVA
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {COMMUNITY.map((c) => (
          <Portrait key={c.name} {...c} />
        ))}
      </div>
    </section>
  );
}

function Portrait({
  name,
  city,
  quote,
  image,
}: {
  name: string;
  city: string;
  quote: string;
  image: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  return (
    <div ref={ref} className="relative aspect-[5/6] overflow-hidden bg-[var(--bg-asphalt)]">
      <motion.div
        initial={{ filter: 'blur(8px)', scale: 1.04 }}
        animate={inView ? { filter: 'blur(0px)', scale: 1 } : { filter: 'blur(8px)', scale: 1.04 }}
        transition={{ duration: 1.4, ease: [0.18, 0, 0, 1] }}
        className="absolute inset-0"
      >
        <Image src={image} alt={name} fill sizes="50vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      <div className="absolute left-6 right-6 bottom-6 space-y-2 text-[var(--ink)]">
        <p className="font-display text-h3 tracking-[-0.02em]">{name}</p>
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {city}
        </p>
        <p className="font-serif italic text-body max-w-md text-[var(--ink)]">{`“${quote}”`}</p>
      </div>
    </div>
  );
}
