'use client';
import { PurpleFlow } from '@/components/sections/purple-flow';
import { CountUp } from '@/components/ui/count-up';
import { ViewCounter } from '@/components/ui/view-counter';
import { isBackForwardNav } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef } from 'react';

export function HeroManifesto() {
  const root = useRef<HTMLDivElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const monoLeftRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);

  // pointer-parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 80, damping: 24 });
  const spy = useSpring(py, { stiffness: 80, damping: 24 });

  useGSAP(
    () => {
      if (!root.current) return;
      const bypass = isBackForwardNav();

      const tl = gsap.timeline({ defaults: { ease: 'p1-out' } });

      // Estado inicial del contenido
      const titleEl = titleRef.current;
      const monoLeftEl = monoLeftRef.current;
      const circleEl = circleRef.current;
      const dragEl = dragRef.current;
      const counterEl = counterRef.current;

      if (titleEl) {
        const split = new SplitText(titleEl, {
          type: 'chars',
          charsClass: 'split-char',
        });
        gsap.set(split.chars, { yPercent: 110, rotateZ: 8, opacity: 0 });

        if (bypass) {
          gsap.set(curtainRef.current, { display: 'none' });
          gsap.set(split.chars, { yPercent: 0, rotateZ: 0, opacity: 1 });
          gsap.set([monoLeftEl, circleEl, dragEl, counterEl], { opacity: 1 });
          return;
        }

        // bloquear scroll en t=0
        document.body.style.overflow = 'hidden';

        // Cortina cubriendo
        tl.set(curtainRef.current, { display: 'grid' });

        // Letras del centro de la cortina
        const curtainTitle = curtainRef.current?.querySelector('[data-curtain-title]');
        if (curtainTitle) {
          const curtainSplit = new SplitText(curtainTitle, { type: 'chars' });
          gsap.set(curtainSplit.chars, { yPercent: 110, rotateZ: 6, opacity: 0 });
          tl.to(
            curtainSplit.chars,
            { yPercent: 0, rotateZ: 0, opacity: 1, duration: 0.9, ease: 'p1-snap', stagger: 0.045 },
            0,
          );
        }

        // Mono micro debajo de la cortina (text writer)
        const curtainStep = curtainRef.current?.querySelector('[data-curtain-step]');
        if (curtainStep) {
          tl.to(curtainStep, { text: 'INICIANDO...', duration: 0.6 }, 1.0)
            .to(curtainStep, { text: 'PRIMER DROP...', duration: 0.6 }, 1.8)
            .to(curtainStep, { text: 'SEVILLA · MMXXVI · ED. 001', duration: 0.8 }, 2.6);
        }

        // Subir cortina (t=3.0 → 4.2)
        tl.to(
          curtainRef.current,
          { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'p1-out' },
          3.0,
        );

        // Letras hero entran (t=4.0)
        tl.to(
          split.chars,
          {
            yPercent: 0,
            rotateZ: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.04,
            ease: 'p1-snap',
          },
          4.0,
        );

        // Mono left typewriter
        if (monoLeftEl) {
          gsap.set(monoLeftEl, { opacity: 0 });
          tl.to(monoLeftEl, { opacity: 1, duration: 0.6 }, 4.6);
        }

        // Counter
        if (counterEl) {
          gsap.set(counterEl, { opacity: 0, y: 8 });
          tl.to(counterEl, { opacity: 1, y: 0, duration: 0.6 }, 5.0);
        }

        // Círculo
        if (circleEl) {
          gsap.set(circleEl, { scale: 0.6, opacity: 0 });
          tl.to(circleEl, { scale: 1, opacity: 1, duration: 0.7, ease: 'p1-out' }, 5.2);
        }

        // Drag indicator
        if (dragEl) {
          gsap.set(dragEl, { opacity: 0 });
          tl.to(dragEl, { opacity: 1, duration: 0.5 }, 5.8);
        }

        tl.add(() => {
          document.body.style.overflow = '';
          if (curtainRef.current) curtainRef.current.style.display = 'none';
        }, '+=0.2');
      }

      // Círculo rotación infinita
      if (circleEl) {
        gsap.to(circleEl.querySelector('[data-circle-text]'), {
          rotation: 360,
          repeat: -1,
          ease: 'none',
          duration: 18,
          transformOrigin: 'center center',
        });
      }

      // Drag down loop
      if (dragEl) {
        const dragSplit = new SplitText(dragEl, { type: 'chars' });
        gsap.fromTo(
          dragSplit.chars,
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: { each: 0.08, repeat: -1, yoyo: true },
            duration: 0.6,
            ease: 'p1-out',
          },
        );
      }

      // Parallax salida al scrollear
      gsap.to(root.current.querySelector('[data-parallax]'), {
        yPercent: -25,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      return () => {
        // Restaurar el scroll SIEMPRE: si el componente se desmonta durante la
        // animación de carga, el body se quedaría con overflow:hidden y la página
        // congelada. Esto lo evita.
        document.body.style.overflow = '';
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: root },
  );

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(nx * 6);
    py.set(ny * 4);
  }

  return (
    <section
      ref={root}
      onPointerMove={onPointerMove}
      className="relative h-[100dvh] w-full overflow-hidden bg-[var(--bg-void)]"
    >
      {/* Fondo de vídeo morado generativo — siempre activo */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <PurpleFlow className="h-full w-full" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(22,19,31,0.35) 0%, rgba(22,19,31,0.15) 40%, rgba(22,19,31,0.75) 100%)',
          }}
        />
      </div>

      {/* Cortina de carga */}
      <div
        ref={curtainRef}
        className="fixed inset-0 grid place-items-center bg-[var(--bg-void)] text-[var(--ink)]"
        style={{ zIndex: 'var(--z-loader)' as unknown as number }}
      >
        <div className="text-center space-y-6">
          <h1
            data-curtain-title
            className="font-display text-display tracking-[-0.05em] leading-[0.84] uppercase"
          >
            PROYECTO 1
          </h1>
          <p
            data-curtain-step
            className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]"
          >
            CARGANDO MANIFIESTO...
          </p>
        </div>
      </div>

      {/* Contenido del Acto I */}
      <div
        data-parallax
        className="relative h-full"
        style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
      >
        {/* Tipografía mega */}
        <motion.div
          ref={titleRef}
          style={{ x: spx, y: spy }}
          className="absolute top-[22vh] left-[var(--grid-margin)] right-[var(--grid-margin)] font-display text-mega uppercase text-[var(--ink)] mix-blend-difference pointer-events-none"
        >
          <span className="block leading-[0.84]">PROYECTO</span>
          <span className="block leading-[0.84] pl-[8vw]">01</span>
        </motion.div>

        {/* Mono micros izquierda */}
        <div
          ref={monoLeftRef}
          className="absolute bottom-[14vh] left-[var(--grid-margin)] font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] space-y-1 max-w-[40ch]"
        >
          <p>MMXXVI — ED. 001 — SEVILLA</p>
          <p>PRIMER DROP — 8 OBJETOS NUMERADOS</p>
        </div>

        {/* Contador */}
        <div ref={counterRef} className="absolute bottom-[10vh] right-[var(--grid-margin)]">
          <ViewCounter />
        </div>

        {/* Círculo rotante */}
        <div
          ref={circleRef}
          className="absolute bottom-[22vh] right-[var(--grid-margin)] w-[220px] h-[220px]"
        >
          <svg
            viewBox="0 0 220 220"
            data-circle-text
            className="absolute inset-0 mix-blend-difference"
          >
            <defs>
              <path
                id="circ"
                d="M110,110 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0"
                fill="none"
              />
            </defs>
            <text className="fill-[var(--ink)] font-mono text-[10px] uppercase tracking-[0.3em]">
              <textPath href="#circ" startOffset="0">
                DROP 01 · DROP 01 · DROP 01 · DROP 01 · DROP 01 ·
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 grid place-items-center text-[var(--ink)]">
            <span aria-hidden className="text-2xl">
              ▾
            </span>
          </div>
        </div>

        {/* Drag down indicator */}
        <div
          ref={dragRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-micro uppercase tracking-[0.6em] text-[var(--ink-mute)]"
        >
          D R A G &nbsp; D O W N
        </div>

        {/* Initial counter animado al cargar */}
        <div className="hidden">
          <CountUp value={47} duration={0.6} />
        </div>
      </div>
    </section>
  );
}
