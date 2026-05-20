'use client';
import { play as playSound, stop as stopSound } from '@/lib/audio';
import { useAudioStore } from '@/lib/store/audio';
import type { SoundKey } from '@/lib/types';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

type Ctx = {
  muted: boolean;
  hasConsented: boolean;
  toggleMute: () => void;
  giveConsent: () => void;
  play: (key: SoundKey) => void;
  stop: (key: SoundKey) => void;
};

const AudioCtx = createContext<Ctx | null>(null);

export function AudioContextProvider({ children }: { children: React.ReactNode }) {
  const muted = useAudioStore((s) => s.muted);
  const hasConsented = useAudioStore((s) => s.hasConsented);
  const hasPlayedIntro = useAudioStore((s) => s.hasPlayedIntro);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const giveConsent = useAudioStore((s) => s.giveConsent);
  const setIntroPlayed = useAudioStore((s) => s.setIntroPlayed);

  // Consent capture: primer click / pointerdown desbloquea audio APIs.
  useEffect(() => {
    if (hasConsented) return;
    const onFirstGesture = () => {
      giveConsent();
    };
    window.addEventListener('pointerdown', onFirstGesture, { once: true });
    window.addEventListener('keydown', onFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('keydown', onFirstGesture);
    };
  }, [hasConsented, giveConsent]);

  // Tras consent, si no muted, reproducir intro una sola vez.
  useEffect(() => {
    if (!hasConsented || muted || hasPlayedIntro) return;
    const t = setTimeout(() => {
      playSound('intro', { muted });
      setIntroPlayed();
    }, 200);
    return () => clearTimeout(t);
  }, [hasConsented, muted, hasPlayedIntro, setIntroPlayed]);

  const play = useCallback(
    (key: SoundKey) => {
      if (!hasConsented) return;
      void playSound(key, { muted });
    },
    [muted, hasConsented],
  );

  const stop = useCallback((key: SoundKey) => {
    void stopSound(key);
  }, []);

  const value = useMemo<Ctx>(
    () => ({ muted, hasConsented, toggleMute, giveConsent, play, stop }),
    [muted, hasConsented, toggleMute, giveConsent, play, stop],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be inside AudioContextProvider');
  return ctx;
}
