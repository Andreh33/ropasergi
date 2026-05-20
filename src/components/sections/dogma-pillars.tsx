'use client';
import { DOGMAS } from '@/lib/data/manifesto';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

export function DogmaPillars() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const dogmaEls = gsap.utils.toArray<HTMLElement>('[data-dogma]', root.current);

      // estado inicial: solo el primero visible
      dogmaEls.forEach((el, idx) => {
        gsap.set(el, { autoAlpha: idx === 0 ? 1 : 0 });
        const word = el.querySelector('[data-word]');
        const main = el.querySelector('[data-main]');
        const sub = el.querySelector('[data-sub]');
        const num = el.querySelector('[data-num]');
        if (idx > 0) {
          gsap.set(word, { xPercent: 100 });
          gsap.set(main, { yPercent: 110, autoAlpha: 0 });
          gsap.set(sub, { autoAlpha: 0, yPercent: 50 });
          gsap.set(num, { autoAlpha: 0 });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=190%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Transición 0 → 1
      const a = dogmaEls[0];
      const b = dogmaEls[1];
      if (a && b) {
        const aWord = a.querySelector('[data-word]');
        const aMain = a.querySelector('[data-main]');
        const aSub = a.querySelector('[data-sub]');
        const aNum = a.querySelector('[data-num]');
        const bWord = b.querySelector('[data-word]');
        const bMain = b.querySelector('[data-main]');
        const bSub = b.querySelector('[data-sub]');
        const bNum = b.querySelector('[data-num]');

        tl.addLabel('to2', 0.33)
          .to(aWord, { xPercent: -100, yPercent: 20, ease: 'p1-in', duration: 0.07 }, 'to2')
          .to(aMain, { yPercent: -120, autoAlpha: 0, ease: 'p1-in', duration: 0.07 }, 'to2')
          .to(aSub, { autoAlpha: 0, yPercent: -50, ease: 'p1-in', duration: 0.07 }, 'to2')
          .to(aNum, { autoAlpha: 0, duration: 0.07 }, 'to2')
          .set(a, { autoAlpha: 0 }, '>')
          .set(b, { autoAlpha: 1 }, '<')
          .to(bWord, { xPercent: 0, yPercent: 0, ease: 'p1-out', duration: 0.07 })
          .to(bMain, { yPercent: 0, autoAlpha: 1, ease: 'p1-out', duration: 0.08 }, '<')
          .to(bSub, { yPercent: 0, autoAlpha: 1, ease: 'p1-out', duration: 0.08 }, '<+0.02')
          .to(bNum, { autoAlpha: 1, duration: 0.06 }, '<');
      }

      // Transición 1 → 2
      const c = dogmaEls[2];
      if (b && c) {
        const bWord = b.querySelector('[data-word]');
        const bMain = b.querySelector('[data-main]');
        const bSub = b.querySelector('[data-sub]');
        const bNum = b.querySelector('[data-num]');
        const cWord = c.querySelector('[data-word]');
        const cMain = c.querySelector('[data-main]');
        const cSub = c.querySelector('[data-sub]');
        const cNum = c.querySelector('[data-num]');

        tl.addLabel('to3', 0.66)
          .to(bWord, { xPercent: -100, yPercent: 20, ease: 'p1-in', duration: 0.07 }, 'to3')
          .to(bMain, { yPercent: -120, autoAlpha: 0, duration: 0.07 }, 'to3')
          .to(bSub, { autoAlpha: 0, yPercent: -50, duration: 0.07 }, 'to3')
          .to(bNum, { autoAlpha: 0, duration: 0.07 }, 'to3')
          .set(b, { autoAlpha: 0 }, '>')
          .set(c, { autoAlpha: 1 }, '<')
          .to(cWord, { xPercent: 0, yPercent: 0, ease: 'p1-out', duration: 0.07 })
          .to(cMain, { yPercent: 0, autoAlpha: 1, duration: 0.08 }, '<')
          .to(cSub, { yPercent: 0, autoAlpha: 1, duration: 0.08 }, '<+0.02')
          .to(cNum, { autoAlpha: 1, duration: 0.06 }, '<');
      }

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-[var(--bg-asphalt)]"
      aria-label="Los tres dogmas"
    >
      {/* Textura fondo */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] mix-blend-difference"
        style={{
          backgroundImage:
            'radial-gradient(at 30% 20%, rgba(204,255,0,0.05) 0%, transparent 60%), radial-gradient(at 80% 80%, rgba(255,31,106,0.04) 0%, transparent 60%)',
        }}
      />

      {DOGMAS.map((d, i) => (
        <article
          key={d.id}
          data-dogma
          data-dogma-id={d.id}
          className="absolute inset-0"
          style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
        >
          <p
            data-num
            className="absolute top-[12vh] right-[var(--grid-margin)] font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]"
          >
            {d.numerator}
          </p>

          <h2
            data-word
            aria-hidden
            className="absolute bottom-[-6vh] left-[var(--grid-margin)] font-display text-mega uppercase leading-[0.78] tracking-[-0.05em] text-[var(--ink-faint)] pointer-events-none select-none"
            style={{ willChange: 'transform' }}
          >
            {d.word}
          </h2>

          <div className="relative h-full grid place-items-center">
            <div className="max-w-[78%] space-y-8 text-center">
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

          {/* Acento neón discreto en uno de cada tres */}
          <span
            aria-hidden
            className="absolute top-[18vh] left-[var(--grid-margin)] font-mono text-micro uppercase tracking-[0.18em] text-[var(--acid)]"
          >
            {i === 0 ? '· · ·' : i === 1 ? '· · · ·' : '· · · · ·'}
          </span>
        </article>
      ))}
    </section>
  );
}
