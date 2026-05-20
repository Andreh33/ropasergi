'use client';
import { LiveClock } from '@/components/ui/live-clock';
import Link from 'next/link';

const COLUMNS = [
  {
    title: 'DROP',
    items: [
      { label: 'Drop 01', href: '/drop' },
      { label: 'Próximo drop', href: '/drop' },
      { label: 'Tallas', href: '/leyenda#tallas' },
      { label: 'Cuidados de prenda', href: '/leyenda#cuidados' },
    ],
  },
  {
    title: 'CULTO',
    items: [
      { label: 'Newsletter', href: '/#culto' },
      { label: 'Discord (próximamente)', href: '#' },
      { label: 'Manuscritos', href: '/manifiesto' },
      { label: 'Embajadores', href: '/manifiesto' },
    ],
  },
  {
    title: 'MARCA',
    items: [
      { label: 'Manifiesto', href: '/manifiesto' },
      { label: 'Trabaja con nosotros', href: '/leyenda#trabajo' },
      { label: 'Sevilla', href: '/manifiesto' },
    ],
  },
  {
    title: 'LEGAL',
    items: [
      { label: 'Leyenda', href: '/leyenda' },
      { label: 'Política de cookies', href: '/leyenda#cookies' },
      { label: 'Devoluciones', href: '/leyenda#devoluciones' },
      { label: 'Aviso legal', href: '/leyenda' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-[var(--bg-void)] border-t border-[var(--stroke)] text-[var(--ink)]"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <div className="pt-24 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] mb-5">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      data-cursor="link"
                      className="text-body text-[var(--ink)] hover:text-[var(--acid)] transition-colors"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="font-display uppercase leading-[0.78] tracking-[-0.05em] text-[clamp(6rem,28vw,28rem)] select-none translate-y-[14%] text-[var(--ink-faint)]"
      >
        PROYECTO 1
      </div>

      <div className="pb-6 pt-8 flex items-center justify-between border-t border-[var(--stroke)] text-[var(--ink-mute)]">
        <p className="font-mono text-micro uppercase tracking-[0.18em]">
          MMXXVI © PROYECTO UNO SL · SEVILLA · ANDALUCÍA · ALMACÉN DE INTENCIONES
        </p>
        <LiveClock className="font-mono text-micro uppercase tracking-[0.18em] hidden md:block" />
      </div>
    </footer>
  );
}
