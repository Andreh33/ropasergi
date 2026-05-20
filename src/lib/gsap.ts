// Re-export gsap as a single module so plugins are registered once.
import { gsap } from 'gsap';

export const D = {
  micro: 0.18,
  short: 0.45,
  base: 0.9,
  long: 1.4,
  epic: 2.4,
} as const;

export const EASES = {
  out: 'p1-out',
  in: 'p1-in',
  inOut: 'p1-inOut',
  snap: 'p1-snap',
  drag: 'p1-drag',
} as const;

export { gsap };
