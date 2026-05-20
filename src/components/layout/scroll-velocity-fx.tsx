'use client';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export function ScrollVelocityFX() {
  const lastT = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    lastT.current = performance.now();
    lastY.current = window.scrollY;

    function onScroll() {
      const now = performance.now();
      const dt = Math.max(now - lastT.current, 1);
      const dy = window.scrollY - lastY.current;
      const velocity = Math.abs(dy) / dt; // px/ms
      const main = document.querySelector('main');

      if (main && velocity > 4.5) {
        gsap.fromTo(
          main,
          { filter: 'blur(3px)' },
          { filter: 'blur(0px)', duration: 0.18, ease: 'power2.out' },
        );
      }
      if (main && velocity > 8) {
        const offset = (Math.random() - 0.5) * 8;
        gsap.fromTo(main, { x: offset }, { x: 0, duration: 0.12, ease: 'power2.out' });
      }

      lastT.current = now;
      lastY.current = window.scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      const main = document.querySelector('main') as HTMLElement | null;
      if (main) {
        main.style.filter = '';
        main.style.transform = '';
      }
    };
  }, []);

  return null;
}
