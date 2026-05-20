'use client';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { TextPlugin } from 'gsap/TextPlugin';
import { useEffect } from 'react';

let registered = false;

export function GsapContext({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (registered) return;
    gsap.registerPlugin(
      ScrollTrigger,
      SplitText,
      CustomEase,
      Flip,
      Observer,
      DrawSVGPlugin,
      TextPlugin,
    );
    CustomEase.create('p1-out', 'M0,0 C0.18,0 0,1 1,1');
    CustomEase.create('p1-in', 'M0,0 C0.6,0 0.8,0.2 1,1');
    CustomEase.create('p1-inOut', 'M0,0 C0.65,0 0.35,1 1,1');
    CustomEase.create('p1-snap', 'M0,0 C0.6,0 0.05,1 1,1');
    CustomEase.create('p1-drag', 'M0,0 C0.25,0.1 0.25,1 1,1');
    registered = true;
  }, []);
  return <>{children}</>;
}
