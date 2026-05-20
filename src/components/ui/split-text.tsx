'use client';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { SplitText as GsapSplitText } from 'gsap/SplitText';
import { useRef } from 'react';

type Props = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  splitBy?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  from?: gsap.TweenVars;
  trigger?: 'mount' | 'scroll';
  start?: string;
  yPercent?: number;
  rotateZ?: number;
};

export function SplitText({
  text,
  as = 'span',
  className,
  splitBy = 'chars',
  stagger = 0.025,
  duration = 0.9,
  delay = 0,
  ease = 'p1-out',
  trigger = 'scroll',
  start = 'top 85%',
  yPercent = 110,
  rotateZ = 0,
  from,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as as 'span';

  useGSAP(
    () => {
      if (!ref.current) return;
      const split = new GsapSplitText(ref.current, {
        type: splitBy,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      });
      const targets =
        splitBy === 'chars' ? split.chars : splitBy === 'words' ? split.words : split.lines;

      const baseFrom: gsap.TweenVars = {
        yPercent,
        rotateZ,
        opacity: 0,
        ...from,
      };

      const animation: gsap.TweenVars = {
        ...baseFrom,
        duration,
        ease,
        stagger,
        delay,
      };

      if (trigger === 'scroll') {
        animation.scrollTrigger = {
          trigger: ref.current,
          start,
          toggleActions: 'play none none none',
        };
      }

      gsap.from(targets, animation);

      return () => {
        split.revert();
      };
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <Tag ref={ref as React.RefObject<HTMLSpanElement>} className={cn(className)}>
      {text}
    </Tag>
  );
}
