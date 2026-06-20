"use client";
import { use, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, Tag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart";
import { useRecentlyViewedStore } from "@/store/recentlyViewed";
import { useProduct } from "@/hooks/useCatalog";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { mediaUrl } from "@/lib/utils";
import RelatedProducts from "@/components/shop/RelatedProducts";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import WishlistButton from "@/components/shop/WishlistButton";
import { toast } from "sonner";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const addToRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);
  const { data: product, isLoading } = useProduct(slug);
  const { currency } = useCurrencyStore();

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [product, addToRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <p className="text-center py-20 text-muted-foreground">
        {t("productNotFound")}
      </p>
    );

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(t("addedToCart", { name: product.name }), {
      description: t("qtyDescription", { qty: quantity }),
    });
  };

  return (
    <div className="space-y-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">
          {tc("home")}
        </Link>
        <span>/</span>
        <Link
          href="/catalog"
          className="hover:text-foreground transition-colors"
        >
          {t("title")}
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/catalog?category=${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-50">
          {product.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {product.image ? (
              <Image
                src={mediaUrl(product.image)!}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-20 w-20 text-muted-foreground/20" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            {product.category && (
              <Link
                href={`/catalog?category=${product.category.slug}`}
                className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-bold leading-tight">
                {product.name}
              </h1>
              <WishlistButton productId={product.id} />
            </div>
          </div>

          <div className="flex items-end gap-4">
            <p className="text-4xl font-black text-primary">
              {formatPrice(product.price, currency)}
            </p>
            <p className="text-sm pb-1.5">
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-medium">
                  {t("inStock", { count: product.stock })}
                </span>
              ) : (
                <span className="text-destructive font-medium">
                  {t("outOfStock")}
                </span>
              )}
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link key={tag.id} href={`/catalog?tags=${tag.slug}`}>
                  <Badge
                    variant="emerald"
                    className="cursor-pointer hover:bg-emerald-200 transition-colors"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {product.attributes.length > 0 && (
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("specifications")}
              </p>
              {product.attributes.map((attr) => (
                <div
                  key={attr.key}
                  className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-muted-foreground">{attr.key}</span>
                  <span className="font-medium">{attr.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 hover:bg-muted transition-colors font-medium text-lg"
                >
                  −
                </button>
                <span className="px-5 py-2.5 font-bold min-w-14 text-center border-x">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-4 py-2.5 hover:bg-muted transition-colors font-medium text-lg"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("subtotal")}{" "}
                <span className="font-bold text-foreground">
                  {formatPrice(parseFloat(product.price) * quantity, currency)}
                </span>
              </p>
            </div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="luxury"
                size="lg"
                className="w-full gap-2 h-12 text-base"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock === 0 ? t("outOfStock") : t("addToCart")}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="border-t" />
      <RelatedProducts
        categorySlug={product.category?.slug}
        currentSlug={product.slug}
      />
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}
