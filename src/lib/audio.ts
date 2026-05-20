'use client';
import type { Howl } from 'howler';
import type { SoundKey } from './types';

type Slot = { howl: Howl | null; src: string[]; volume: number; loop?: boolean };

const slots: Record<SoundKey, Slot> = {
  intro: { howl: null, src: ['/audio/intro.mp3'], volume: 0.6 },
  tick: { howl: null, src: ['/audio/tick.mp3'], volume: 0.18 },
  tap: { howl: null, src: ['/audio/tap.mp3'], volume: 0.22 },
  swipe: { howl: null, src: ['/audio/swipe.mp3'], volume: 0.4 },
  add: { howl: null, src: ['/audio/add.mp3'], volume: 0.35 },
  error: { howl: null, src: ['/audio/error.mp3'], volume: 0.4 },
  unlock: { howl: null, src: ['/audio/unlock.mp3'], volume: 0.5 },
  ambient: { howl: null, src: ['/audio/ambient.mp3'], volume: 0.12, loop: true },
};

async function ensureLoaded(key: SoundKey) {
  const slot = slots[key];
  if (slot.howl) return slot.howl;
  const { Howl } = await import('howler');
  slot.howl = new Howl({
    src: slot.src,
    volume: slot.volume,
    loop: !!slot.loop,
    preload: true,
    // Suppress noisy errors if file 404 (assets aún no descargados)
    onloaderror: () => {
      /* asset ausente — silencio */
    },
  });
  return slot.howl;
}

export async function play(key: SoundKey, opts?: { muted?: boolean }) {
  if (typeof window === 'undefined') return;
  if (opts?.muted) return;
  try {
    const howl = await ensureLoaded(key);
    howl.play();
  } catch {
    /* sin sonido si falla */
  }
}

export async function stop(key: SoundKey) {
  const slot = slots[key];
  slot.howl?.stop();
}
