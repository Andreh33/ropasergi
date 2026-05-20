'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AudioState = {
  muted: boolean;
  hasConsented: boolean;
  hasPlayedIntro: boolean;
  toggleMute: () => void;
  giveConsent: () => void;
  setIntroPlayed: () => void;
};

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      muted: true,
      hasConsented: false,
      hasPlayedIntro: false,
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      giveConsent: () => set({ hasConsented: true }),
      setIntroPlayed: () => set({ hasPlayedIntro: true }),
    }),
    {
      name: 'proyecto-1:audio',
      partialize: (s) => ({ muted: s.muted, hasConsented: s.hasConsented }),
    },
  ),
);
