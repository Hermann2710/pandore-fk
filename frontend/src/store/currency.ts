import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Currency } from "@/types";

interface CurrencyStore {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const XAF_DEFAULT: Currency = {
  id: 0,
  code: "XAF",
  name: "CFA Franc BEAC",
  symbol: "FCFA",
  rate: "1",
  is_active: true,
  is_default: true,
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: XAF_DEFAULT,
      setCurrency: (c) => set({ currency: c }),
    }),
    {
      name: "pandore-currency",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** Convert a XAF price string to the selected currency and format it. */
export function formatPrice(xafAmount: string | number, currency: Currency): string {
  const amount = parseFloat(String(xafAmount)) * parseFloat(String(currency.rate));
  // XAF has no decimals by convention; others use 2
  const decimals = currency.code === "XAF" ? 0 : 2;
  return `${currency.symbol} ${amount.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}
