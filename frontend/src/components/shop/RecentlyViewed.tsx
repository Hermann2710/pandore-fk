"use client";
import ProductStrip from "./ProductStrip";
import { useRecentlyViewedStore } from "@/store/recentlyViewed";
import { useHydrated } from "@/hooks/useHydrated";

interface Props { currentProductId: number; }

export default function RecentlyViewed({ currentProductId }: Props) {
  const hydrated = useHydrated();
  const items = useRecentlyViewedStore((s) => s.items);

  // Don't render anything until the store has rehydrated from localStorage
  if (!hydrated) return null;

  const visible = items.filter((p) => p.id !== currentProductId);
  return <ProductStrip title="Recently Viewed" products={visible} />;
}
