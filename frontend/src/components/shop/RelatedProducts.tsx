"use client";
import ProductStrip from "./ProductStrip";
import { useRelatedProducts } from "@/hooks/useCatalog";

interface Props {
  categorySlug: string | undefined;
  currentSlug: string;
}

export default function RelatedProducts({ categorySlug, currentSlug }: Props) {
  const { data: products, isLoading } = useRelatedProducts(categorySlug, currentSlug);

  return (
    <ProductStrip
      title="Related Products"
      products={products}
      isLoading={isLoading}
    />
  );
}
