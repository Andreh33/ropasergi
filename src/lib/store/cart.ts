'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartItem, Size } from '../types';

type CartState = {
  isOpen: boolean;
  items: CartItem[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, 'addedAt'>) => void;
  remove: (slug: string, size: Size) => void;
  updateQty: (slug: string, size: Size, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

const MAX_ITEMS = 12;

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      isOpen: false,
      items: [],
      open: () =>
        set((s) => {
          s.isOpen = true;
        }),
      close: () =>
        set((s) => {
          s.isOpen = false;
        }),
      toggle: () =>
        set((s) => {
          s.isOpen = !s.isOpen;
        }),
      add: (item) =>
        set((s) => {
          const totalCount = s.items.reduce((acc, i) => acc + i.qty, 0);
          if (totalCount >= MAX_ITEMS) return;
          const existing = s.items.find((i) => i.slug === item.slug && i.size === item.size);
          if (existing) {
            existing.qty += item.qty;
          } else {
            s.items.push({ ...item, addedAt: Date.now() });
          }
        }),
      remove: (slug, size) =>
        set((s) => {
          s.items = s.items.filter((i) => !(i.slug === slug && i.size === size));
        }),
      updateQty: (slug, size, qty) =>
        set((s) => {
          const it = s.items.find((i) => i.slug === slug && i.size === size);
          if (!it) return;
          if (qty <= 0) {
            s.items = s.items.filter((i) => !(i.slug === slug && i.size === size));
          } else {
            it.qty = qty;
          }
        }),
      clear: () =>
        set((s) => {
          s.items = [];
        }),
      total: () => get().items.reduce((acc, it) => acc + it.price * it.qty, 0),
      count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
    })),
    {
      name: 'proyecto-1:cart',
      partialize: (s) => ({ items: s.items }),
    },
  ),
);
