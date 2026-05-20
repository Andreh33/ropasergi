'use client';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useRef } from 'react';

gsap.registerPlugin(DrawSVGPlugin);

const C = 110; // centro
const R_OUTER = 104;
const R_INNER = 86;
const R_TEXT = 96;
const R_TICK_OUT = 104;
const R_TICK_IN = 97;

// redondeo determinista para evitar mismatch de hidratación por precisión de float
const r3 = (n: number) => Math.round(n * 1000) / 1000;

// 36 ticks radiales
const TICKS = Array.from({ length: 36 }, (_, i) => {
  const a = (i / 36) * Math.PI * 2;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return {
    x1: r3(C + cos * R_TICK_OUT),
    y1: r3(C + sin * R_TICK_OUT),
    x2: r3(C + cos * R_TICK_IN),
    y2: r3(C + sin * R_TICK_IN),
    long: i % 9 === 0,
  };
});

// 3 marcas de dogma a -90, 30, 150 grados (trinidad)
const DOGMA_MARKS = [-90, 30, 150].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: r3(C + Math.cos(a) * 70), y: r3(C + Math.sin(a) * 70) };
});

type Props = {
  size?: number;
  className?: string;
  /** dispara la animación de estampado al montar */
  autoStamp?: boolean;
  /** retraso del estampado en segundos */
  delay?: number;
};

export function RitualSeal({ size = 240, className, autoStamp = true, delay = 0 }: Props) {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const sealEl = root.current.querySelector('[data-seal]');
      const textRing = root.current.querySelector('[data-text-ring]');
      const rings = root.current.querySelectorAll('[data-draw]');
      const flash = root.current.querySelector('[data-flash]');
      const wave = root.current.querySelector('[data-wave]');

      // rotación continua del anillo de texto
      if (textRing) {
        gsap.to(textRing, {
          rotation: 360,
          transformOrigin: 'center center',
          repeat: -1,
          ease: 'none',
          duration: 26,
        });
      }

      if (!autoStamp) {
        gsap.set(sealEl, { scale: 1, rotate: 0, autoAlpha: 1 });
        gsap.set(rings, { drawSVG: '100%' });
        return;
      }

      gsap.set(sealEl, { scale: 0.32, rotate: -18, autoAlpha: 0 });
      gsap.set(rings, { drawSVG: '0%' });
      gsap.set([flash, wave], { autoAlpha: 0 });

      const tl = gsap.timeline({ delay });
      tl.to(sealEl, {
        scale: 1.12,
        rotate: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: 'p1-snap',
      })
        .to(rings, { drawSVG: '100%', duration: 0.6, ease: 'p1-out' }, '<')
        // impacto del lacre
        .to(flash, { autoAlpha: 0.7, duration: 0.08 }, '-=0.18')
        .to(flash, { autoAlpha: 0, duration: 0.35, ease: 'p1-out' }, '>')
        .to(sealEl, { scale: 1, duration: 0.35, ease: 'p1-out' }, '<')
        // onda expansiva
        .fromTo(
          wave,
          { scale: 0.9, autoAlpha: 0.6 },
          {
            scale: 1.7,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'p1-out',
            transformOrigin: 'center center',
          },
          '<',
        );
    },
    { scope: root, dependencies: [autoStamp] },
  );

  return (
    <div
      ref={root}
      className={cn('relative grid place-items-center', className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* onda expansiva */}
      <span
        data-wave
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: '1px solid var(--neon-blood-glow)' }}
      />
      {/* flash del estampado */}
      <span
        data-flash
        className="absolute inset-[14%] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--neon-blood-glow) 0%, var(--neon-blood) 45%, transparent 72%)',
        }}
      />

      <svg
        data-seal
        viewBox="0 0 220 220"
        width={size}
        height={size}
        className="relative"
        style={{ filter: 'drop-shadow(0 0 14px rgba(255,18,48,0.45))' }}
      >
        <defs>
          <path
            id="ritual-text-path"
            d={`M${C},${C} m-${R_TEXT},0 a${R_TEXT},${R_TEXT} 0 1,1 ${R_TEXT * 2},0 a${R_TEXT},${R_TEXT} 0 1,1 -${R_TEXT * 2},0`}
            fill="none"
          />
        </defs>

        {/* anillos */}
        <circle
          data-draw
          cx={C}
          cy={C}
          r={R_OUTER}
          fill="none"
          stroke="var(--neon-blood)"
          strokeWidth={1.5}
        />
        <circle
          data-draw
          cx={C}
          cy={C}
          r={R_INNER}
          fill="none"
          stroke="var(--neon-blood)"
          strokeWidth={0.75}
          opacity={0.7}
        />

        {/* ticks radiales */}
        <g stroke="var(--neon-blood)" strokeWidth={0.75} opacity={0.65}>
          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              strokeWidth={t.long ? 1.5 : 0.75}
              opacity={t.long ? 1 : 0.5}
            />
          ))}
        </g>

        {/* texto rotando */}
        <g data-text-ring>
          <text
            fill="var(--neon-blood-glow)"
            className="font-mono"
            fontSize="9"
            letterSpacing="3.4"
            style={{ textTransform: 'uppercase' }}
          >
            <textPath href="#ritual-text-path" startOffset="0">
              DESEO · DISCIPLINA · DESPRECIO · PACTO ·
            </textPath>
          </text>
        </g>

        {/* triángulo alquímico invertido (tierra) */}
        <path
          data-draw
          d="M72,82 L148,82 L110,158 Z"
          fill="none"
          stroke="var(--neon-blood)"
          strokeWidth={1.5}
        />
        <line
          data-draw
          x1="86"
          y1="118"
          x2="134"
          y2="118"
          stroke="var(--neon-blood)"
          strokeWidth={1.5}
        />

        {/* 3 marcas de dogma a 120° */}
        {DOGMA_MARKS.map((m, i) => (
          <g key={i}>
            <circle cx={m.x} cy={m.y} r={3.2} fill="var(--neon-blood-glow)" />
            <circle
              cx={m.x}
              cy={m.y}
              r={6.5}
              fill="none"
              stroke="var(--neon-blood)"
              strokeWidth={0.75}
            />
          </g>
        ))}

        {/* sello central */}
        <text
          x={C}
          y={C + 4}
          textAnchor="middle"
          className="font-display"
          fontSize="15"
          fontWeight="900"
          letterSpacing="-0.5"
          fill="var(--neon-blood-glow)"
        >
          P1
        </text>
      </svg>
    </div>
  );
}
