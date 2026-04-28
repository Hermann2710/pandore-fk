"use client";
import { useTranslations } from "next-intl";
import ProductStrip from "./ProductStrip";
import { useRelatedProducts } from "@/hooks/useCatalog";

interface Props { categorySlug: string | undefined; currentSlug: string; }

export default function RelatedProducts({ categorySlug, currentSlug }: Props) {
  const t = useTranslations("catalog");
  const { data: products, isLoading } = useRelatedProducts(categorySlug, currentSlug);
  return <ProductStrip title={t("relatedProducts")} products={products} isLoading={isLoading} />;
}
