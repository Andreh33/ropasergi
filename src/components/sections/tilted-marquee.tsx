'use client';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type BandSpec = {
  text: string;
  angle: number;
  xFrom: number;
  xTo: number;
  highlights: string[];
  font: 'display' | 'serif' | 'mono';
  style: 'fill' | 'outline';
  color: string;
};

const BANDS: BandSpec[] = [
  {
    text: 'PROYECTO 01 ▲ DROP 01 ▲ MMXXVI ▲ ',
    angle: -12,
    xFrom: 30,
    xTo: -30,
    highlights: ['PROYECTO', 'DROP'],
    font: 'display',
    style: 'fill',
    color: 'var(--ink)',
  },
  {
    // banda central en SERIF ITALIC para que destaque al cruzarse con las otras
    text: 'Deseo · Disciplina · Desprecio · ',
    angle: 6,
    xFrom: -30,
    xTo: 30,
    highlights: ['Deseo', 'Disciplina', 'Desprecio'],
    font: 'serif',
    style: 'fill',
    color: 'var(--violet-glow)',
  },
  {
    // banda inferior en OUTLINE display: contraste de relleno vs contorno
    text: 'SEVILLA · ANDALUCÍA · INTEMPERIE · ',
    angle: -18,
    xFrom: 30,
    xTo: -30,
    highlights: ['SEVILLA', 'INTEMPERIE'],
    font: 'mono',
    style: 'outline',
    color: 'var(--acid)',
  },
];

export function TiltedMarquee() {
  const root = useRef<HTMLElement | null>(null);
  const bandsRef = useRef<(HTMLDivElement | null)[]>([]);
  const circleX = useMotionValue(0);
  const circleY = useMotionValue(0);
  const sx = useSpring(circleX, { stiffness: 80, damping: 28 });
  const sy = useSpring(circleY, { stiffness: 80, damping: 28 });
  const [pointerActive, setPointerActive] = useState(false);

  useGSAP(
    () => {
      bandsRef.current.forEach((band, i) => {
        if (!band) return;
        const spec = BANDS[i];
        if (!spec) return;
        gsap.fromTo(
          band,
          { xPercent: spec.xFrom },
          {
            xPercent: spec.xTo,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          },
        );
      });
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    },
    { scope: root as React.RefObject<HTMLElement> },
  );

  useEffect(() => {
    if (!root.current) return;
    const el = root.current;
    function onMove(e: PointerEvent) {
      const rect = el.getBoundingClientRect();
      circleX.set(e.clientX - rect.left);
      circleY.set(e.clientY - rect.top);
      setPointerActive(true);
    }
    function onLeave() {
      setPointerActive(false);
    }
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [circleX, circleY]);

  return (
    <section
      ref={root}
      className="relative h-[140vh] w-full overflow-hidden bg-[var(--bg-void)] text-[var(--ink)]"
      aria-label="Marquee ladeado"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center gap-10 overflow-hidden">
        {BANDS.map((band, i) => {
          const fontClass =
            band.font === 'serif'
              ? 'font-serif italic'
              : band.font === 'mono'
                ? 'font-mono'
                : 'font-display';
          const isOutline = band.style === 'outline';
          return (
            <div
              key={band.text}
              ref={(el) => {
                bandsRef.current[i] = el;
              }}
              className={`whitespace-nowrap uppercase tracking-[-0.02em] leading-[1] text-[clamp(2.6rem,8vw,8.5rem)] -ml-[50vw] w-[200vw] ${fontClass}`}
              style={{
                transform: `rotate(${band.angle}deg)`,
                transformOrigin: 'center center',
                color: isOutline ? 'transparent' : band.color,
                WebkitTextStroke: isOutline ? `1.5px ${band.color}` : undefined,
              }}
            >
              <RepeatedBand text={band.text} highlights={band.highlights} />
            </div>
          );
        })}
      </div>

      {/* Círculo cursor-follower */}
      <motion.div
        className="hidden md:block absolute top-0 left-0 pointer-events-none"
        style={{
          x: sx,
          y: sy,
          opacity: pointerActive ? 1 : 0,
          transition: 'opacity .4s ease',
        }}
        aria-hidden
      >
        <Link
          href="/drop"
          data-cursor="link"
          data-cursor-label="VIEW THE DROP"
          className="block -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] pointer-events-auto"
        >
          <svg viewBox="0 0 320 320" className="absolute inset-0 mix-blend-difference">
            <defs>
              <path
                id="mq-circ"
                d="M160,160 m-130,0 a130,130 0 1,1 260,0 a130,130 0 1,1 -260,0"
                fill="none"
              />
            </defs>
            <text className="fill-[var(--ink)] font-mono text-[11px] uppercase tracking-[0.4em]">
              <textPath href="#mq-circ" startOffset="0">
                VIEW THE DROP · VIEW THE DROP · VIEW THE DROP ·
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 grid place-items-center text-[var(--ink)]">
            <span className="text-3xl" aria-hidden>
              ▶
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Mobile fallback */}
      <Link
        href="/drop"
        className="md:hidden absolute bottom-8 right-6 inline-flex items-center gap-2 font-mono text-micro uppercase tracking-[0.18em] text-[var(--acid)] border border-[var(--acid)] px-4 py-2"
      >
        VER EL DROP →
      </Link>
    </section>
  );
}

function RepeatedBand({ text, highlights }: { text: string; highlights: string[] }) {
  const repeats = Array.from({ length: 6 });
  return (
    <span>
      {repeats.map((_, i) => (
        <span key={i} className="inline-block">
          {text.split(/(\s+)/).map((w, j) => {
            const clean = w.trim();
            const hi = highlights.includes(clean);
            return (
              <span
                key={`${i}-${j}`}
                className={
                  hi
                    ? 'inline-block text-[var(--ink)] hover:text-[var(--acid)] transition-colors duration-500'
                    : 'inline-block'
                }
                data-highlight={hi || undefined}
              >
                {w}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
