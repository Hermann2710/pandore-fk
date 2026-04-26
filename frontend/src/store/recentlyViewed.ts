import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

const MAX_ITEMS = 8;

interface RecentlyViewedStore {
  items: Product[];
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  addProduct: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      addProduct: (product) =>
        set((state) => {
          const filtered = state.items.filter((p) => p.id !== product.id);
          return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "pandore-recently-viewed",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => { state?.setHasHydrated(true); },
    }
  )
);
