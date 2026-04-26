"use client";
import ProductStrip from "./ProductStrip";
import { useRecentlyViewedStore } from "@/store/recentlyViewed";

interface Props {
  // Exclude the product currently being viewed from the strip
  currentProductId: number;
}

export default function RecentlyViewed({ currentProductId }: Props) {
  const items = useRecentlyViewedStore((s) => s.items);
  const visible = items.filter((p) => p.id !== currentProductId);

  return (
    <ProductStrip
      title="Recently Viewed"
      products={visible}
    />
  );
}
