'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

/**
 * Gestor de scroll. Usamos scroll NATIVO del navegador (sin smooth-scroll de Lenis):
 * los `pin` de ScrollTrigger se sincronizan perfectamente con el scroll nativo, sin
 * los desajustes que producían secciones en negro al arrastrar la barra o usar teclas.
 * Las animaciones (pins, scroll horizontal, reveals) siguen intactas.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // El navegador restaura el scroll al recargar/volver, lo que desincroniza los pins.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // Recalcular medidas de los pins cuando fuentes/recursos cambien el layout.
    const refresh = () => ScrollTrigger.refresh();
    const rafId = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});

    // gsap.ticker mantiene los scrubs fluidos.
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('load', refresh);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
