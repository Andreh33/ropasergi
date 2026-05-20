'use client';
import { DOGMAS } from '@/lib/data/manifesto';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';

/**
 * Tres dogmas como paneles a pantalla completa con reveal al entrar.
 * SIN pin ni timeline scrubbed: el pin anterior dejaba media pantalla en negro.
 * Cada panel llena el viewport y el contenido es visible por defecto (el reveal
 * solo añade movimiento), así nunca queda en negro aunque el trigger no dispare.
 */
export function DogmaPillars() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const panels = gsap.utils.toArray<HTMLElement>('[data-dogma]', root.current);

      for (const panel of panels) {
        const main = panel.querySelector('[data-main]') as HTMLElement | null;
        const sub = panel.querySelector('[data-sub]');
        const word = panel.querySelector('[data-word]');

        if (main) {
          const split = new SplitText(main, { type: 'words' });
          gsap.from(split.words, {
            yPercent: 110,
            opacity: 0,
            stagger: 0.04,
            duration: 0.8,
            ease: 'p1-out',
            immediateRender: false,
            scrollTrigger: { trigger: panel, start: 'top 70%', once: true },
          });
        }
        if (sub) {
          gsap.from(sub, {
            yPercent: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'p1-out',
            delay: 0.25,
            immediateRender: false,
            scrollTrigger: { trigger: panel, start: 'top 70%', once: true },
          });
        }
        // palabra-fondo: parallax suave (sin pin → robusto)
        if (word) {
          gsap.fromTo(
            word,
            { yPercent: 12 },
            {
              yPercent: -12,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            },
          );
        }
      }

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root as React.RefObject<HTMLElement> },
  );

  return (
    <section
      ref={root}
      className="relative w-full bg-[var(--bg-asphalt)]"
      aria-label="Los tres dogmas"
    >
      {DOGMAS.map((d, i) => (
        <article
          key={d.id}
          data-dogma
          className="relative min-h-[100svh] flex items-center overflow-hidden border-b border-[var(--stroke)]"
          style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
        >
          {/* numerador */}
          <p className="absolute top-[14vh] right-[var(--grid-margin)] font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
            {d.numerator}
          </p>
          {/* acento neón */}
          <span
            aria-hidden
            className="absolute top-[14vh] left-[var(--grid-margin)] font-mono text-micro uppercase tracking-[0.18em] text-[var(--acid)]"
          >
            {'· '.repeat(i + 3).trim()}
          </span>

          {/* palabra-fondo gigante */}
          <h2
            data-word
            aria-hidden
            className="absolute -bottom-[4vh] left-[var(--grid-margin)] right-0 font-display text-mega uppercase leading-[0.78] tracking-[-0.05em] text-[var(--ink-faint)] pointer-events-none select-none"
            style={{ willChange: 'transform' }}
          >
            {d.word}
          </h2>

          {/* contenido */}
          <div className="relative w-full grid place-items-center">
            <div className="max-w-[80%] md:max-w-[70%] space-y-8 text-center">
              <p
                data-main
                className="font-display text-display uppercase tracking-[-0.04em] leading-[0.92] text-[var(--ink)]"
              >
                {d.main}
              </p>
              <div data-sub className="font-serif italic text-h3 text-[var(--ink)] space-y-1">
                {d.sub.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
