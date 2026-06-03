import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/lib/constants/menu-catalog";

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.lines.find((l) => l.item.id === item.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.item.id === item.id ? { ...l, quantity: l.quantity + 1 } : l
              ),
            };
          }
          return { lines: [...state.lines, { item, quantity: 1 }] };
        }),

      removeItem: (itemId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.item.id !== itemId) })),

      updateQuantity: (itemId, qty) =>
        set((state) => {
          if (qty <= 0) return { lines: state.lines.filter((l) => l.item.id !== itemId) };
          return {
            lines: state.lines.map((l) =>
              l.item.id === itemId ? { ...l, quantity: qty } : l
            ),
          };
        }),

      clearCart: () => set({ lines: [] }),

      subtotal: () =>
        get().lines.reduce((sum, l) => sum + l.item.priceGhs * l.quantity, 0),

      itemCount: () =>
        get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "odo-adwoa-cart" }
  )
);
