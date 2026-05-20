import { RitualSeal } from '@/components/ui/ritual-seal';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'PACTO FIRMADO',
  description: 'Pacto firmado.',
};

function orderId() {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `P1-MMXXVI-${n}`;
}

export default function PactoFirmadoPage() {
  const order = orderId();
  return (
    <div
      className="relative min-h-screen grid place-items-center bg-[var(--bg-void)] text-[var(--ink)] py-[20vh] overflow-hidden"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      {/* halo ritual de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(255,18,48,0.16) 0%, transparent 55%)',
        }}
      />
      <div className="relative text-center max-w-2xl space-y-10">
        <div className="flex justify-center">
          <RitualSeal size={260} delay={0.3} />
        </div>
        <h1 className="font-display text-display tracking-[-0.04em] leading-[0.88] uppercase">
          PACTO FIRMADO.
        </h1>
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          N.º DE ORDEN: {order}
        </p>
        <div className="font-serif italic text-h3 space-y-4 leading-[1.35] text-[var(--ink)]">
          <p>Hemos recibido tu intención.</p>
          <p>
            En los próximos minutos llegará un correo con el manuscrito de cada prenda. En las
            próximas 48 horas, las prendas.
          </p>
          <p>
            Si no llega nada, escribe a{' '}
            <span className="font-mono not-italic text-[var(--neon-azure)]">
              culto@proyecto-uno.com
            </span>{' '}
            con el número de orden.
          </p>
        </div>
        <Link
          href="/"
          data-cursor="link"
          className="inline-block font-mono text-micro uppercase tracking-[0.18em] border border-[var(--stroke-strong)] px-8 py-4 hover:bg-[var(--neon-azure)] hover:text-[var(--bg-void)] transition-colors"
        >
          VOLVER AL UMBRAL
        </Link>
      </div>
    </div>
  );
}
