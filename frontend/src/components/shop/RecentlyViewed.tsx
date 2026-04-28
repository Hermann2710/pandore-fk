"use client";
import { useTranslations } from "next-intl";
import ProductStrip from "./ProductStrip";
import { useRecentlyViewedStore } from "@/store/recentlyViewed";
import { useHydrated } from "@/hooks/useHydrated";

interface Props { currentProductId: number; }

export default function RecentlyViewed({ currentProductId }: Props) {
  const t = useTranslations("catalog");
  const hydrated = useHydrated();
  const items = useRecentlyViewedStore((s) => s.items);
  if (!hydrated) return null;
  const visible = items.filter((p) => p.id !== currentProductId);
  return <ProductStrip title={t("recentlyViewed")} products={visible} />;
}
