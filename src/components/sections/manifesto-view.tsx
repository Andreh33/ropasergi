'use client';
import { RitualSeal } from '@/components/ui/ritual-seal';
import { DOGMAS, MANIFESTO } from '@/lib/data/manifesto';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';

export function ManifestoView() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const lines = gsap.utils.toArray<HTMLElement>('[data-line]', root.current);
      lines.forEach((line) => {
        const split = new SplitText(line, { type: 'lines', linesClass: 'split-line' });
        gsap.from(split.lines, {
          yPercent: 110,
          opacity: 0,
          stagger: 0.06,
          duration: 0.9,
          ease: 'p1-out',
          scrollTrigger: { trigger: line, start: 'top 85%' },
        });
      });
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root },
  );

  const blocks = MANIFESTO.blocks;

  return (
    <div
      ref={root}
      className="bg-[var(--bg-paper)] text-[var(--bg-void)] min-h-screen pt-[20vh] pb-[18vh]"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <header className="grid grid-cols-12 gap-4 items-end pb-[10vh] border-b border-black/15">
        <p className="col-span-12 md:col-span-5 font-mono text-micro uppercase tracking-[0.18em] text-black/55">
          {MANIFESTO.city} · {MANIFESTO.year} · {MANIFESTO.edition}
        </p>
        <h1 className="col-span-12 md:col-span-7 font-display text-display tracking-[-0.04em] leading-[0.88] uppercase">
          EL MANIFIESTO
        </h1>
      </header>

      <section className="max-w-[68rem] mx-auto py-[12vh] space-y-[10vh]">
        {Object.entries(blocks).map(([key, block]) => (
          <article key={key} className="grid grid-cols-12 gap-6">
            <p className="col-span-12 md:col-span-2 font-mono text-micro uppercase tracking-[0.18em] text-black/55">
              · {block.title}
            </p>
            <div
              data-line
              className="col-span-12 md:col-span-10 font-serif italic text-h2 leading-[1.15]"
            >
              {block.paragraphs.map((p, i) => (
                <p key={i} className="mb-4">
                  {p}
                </p>
              ))}
              {'seal' in block && block.seal ? (
                <p className="mt-8 font-mono text-micro uppercase not-italic tracking-[0.18em] text-black/70">
                  {block.seal}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      {/* Los 3 dogmas en bloque */}
      <section className="max-w-[68rem] mx-auto py-[10vh] border-t border-black/15">
        <h2 className="font-display text-h2 tracking-[-0.04em] uppercase mb-10">TRES REGLAS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {DOGMAS.map((d) => (
            <div key={d.id} className="space-y-3">
              <p className="font-mono text-micro uppercase tracking-[0.18em] text-black/60">
                {d.numerator}
              </p>
              <h3 className="font-display text-h3 tracking-[-0.03em] uppercase">{d.word}</h3>
              <p className="font-serif italic text-body leading-[1.4]">{d.main}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sello ritual de cierre — lacre rojo sobre el papel */}
      <section className="max-w-[68rem] mx-auto pt-[6vh] pb-[2vh] flex flex-col items-center gap-6">
        <RitualSeal size={200} delay={0.1} />
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--neon-blood)]">
          SELLADO · SEVILLA · MMXXVI · ED. 001
        </p>
      </section>
    </div>
  );
}
