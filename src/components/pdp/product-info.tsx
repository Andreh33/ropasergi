'use client';
import type { Product, Size } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { AddToCultButton } from './add-to-cult-button';
import { SizePicker, type SizePickerHandle } from './size-picker';

export function ProductInfo({ product }: { product: Product }) {
  const [size, setSize] = useState<Size | null>(null);
  const sizePickerRef = useRef<SizePickerHandle | null>(null);

  const remaining = product.numbered.available;
  const total = product.numbered.total;
  const lowStock = remaining > 0 && remaining < 5;

  return (
    <div className="space-y-10 py-[18vh]" style={{ paddingRight: 'var(--grid-margin)' }}>
      {/* Identidad */}
      <header className="space-y-3 border-b border-[var(--stroke)] pb-8">
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          EDICIÓN · {product.edition}
        </p>
        <h1 className="font-display text-h2 tracking-[-0.04em] leading-[0.92] uppercase text-[var(--ink)]">
          {product.name}
        </h1>
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          {product.shortDescriptor}
        </p>
      </header>

      {/* Precio */}
      <div className="space-y-1">
        <p className="font-mono text-h2 tracking-[-0.02em] text-[var(--ink)]">
          {formatPrice(product.price.amount)}
        </p>
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          4 PAGOS DE {formatPrice(Math.round(product.price.amount / 4))} SIN INTERESES
        </p>
      </div>

      {/* Stock */}
      <p
        className={`font-mono text-micro uppercase tracking-[0.18em] ${
          lowStock ? 'text-[var(--neon-blood)] animate-pulse' : 'text-[var(--ink-mute)]'
        }`}
      >
        {product.status === 'soldout'
          ? 'AGOTADO · EL CULTO ESTÁ LLENO'
          : `${remaining} DE ${total} RESTANTES`}
      </p>

      {/* Talla */}
      {product.status !== 'soldout' ? (
        <SizePicker
          ref={sizePickerRef}
          sizes={product.sizes}
          soldout={product.soldoutSizes ?? []}
          value={size}
          onChange={setSize}
        />
      ) : null}

      {/* CTA */}
      <div className="space-y-3 pt-4">
        <AddToCultButton
          product={product}
          selectedSize={size}
          onMissingSize={() => sizePickerRef.current?.shake()}
        />
        <Link
          href="/tienda"
          data-cursor="link"
          className="inline-block font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors"
        >
          ← VOLVER A LA TIENDA
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] space-y-1 pt-4 border-t border-[var(--stroke)]">
        <p>ENVÍO 48H · PENÍNSULA INCLUIDO</p>
        <p>DEVOLUCIÓN GRATUITA EN 14 DÍAS</p>
        <p>UN MANUSCRITO DENTRO DE CADA PRENDA</p>
      </div>

      {/* Interpretación */}
      <section className="space-y-5 pt-[10vh]">
        <h2 className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          INTERPRETACIÓN
        </h2>
        <div className="font-serif italic text-h3 text-[var(--ink)] space-y-4 leading-[1.4]">
          {product.editorial.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Ficha técnica */}
      <section className="space-y-3 pt-[6vh]">
        <h2 className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          FICHA TÉCNICA
        </h2>
        <dl className="grid grid-cols-1 gap-2 font-mono text-small text-[var(--ink)]">
          <Spec label="Material" value={product.technical.material} />
          {product.technical.weight ? <Spec label="Peso" value={product.technical.weight} /> : null}
          <Spec label="Origen" value={product.technical.origin} />
          <Spec label="Confección" value={product.technical.tailoring} />
        </dl>
      </section>

      {/* Cuidados */}
      <section className="space-y-3 pt-[6vh] pb-[12vh]">
        <h2 className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          RITUAL DE CUIDADO
        </h2>
        <ul className="font-serif italic text-h3 text-[var(--ink)] space-y-2">
          {product.care.map((c) => (
            <li key={c} className="flex gap-3">
              <span
                aria-hidden
                className="text-[var(--neon-azure)] not-italic font-mono text-small leading-[1.6]"
              >
                ▸
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col md:flex-row md:gap-6 border-b border-[var(--stroke)] py-3">
      <dt className="uppercase tracking-[0.12em] text-[var(--ink-mute)] min-w-[120px]">{label}</dt>
      <dd className="text-[var(--ink)]">{value}</dd>
    </div>
  );
}
