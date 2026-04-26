import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

const MAX_ITEMS = 8;

interface RecentlyViewedStore {
  items: Product[];
  addProduct: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      addProduct: (product) =>
        set((state) => {
          // Remove duplicate then prepend — most recent first
          const filtered = state.items.filter((p) => p.id !== product.id);
          return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "pandore-recently-viewed" }
  )
);
