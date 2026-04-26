"use client";
import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Tag, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart";
import { useRecentlyViewedStore } from "@/store/recentlyViewed";
import { useProduct } from "@/hooks/useCatalog";
import RelatedProducts from "@/components/shop/RelatedProducts";
import RecentlyViewed from "@/components/shop/RecentlyViewed";
import { toast } from "sonner";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const addToRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);
  const { data: product, isLoading } = useProduct(slug);

  // Track this visit as soon as the product loads
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
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-48 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <p className="text-center py-20 text-muted-foreground">
        Product not found.
      </p>
    );

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`, {
      description: `Qty: ${quantity}`,
    });
  };

  return (
    <div className="space-y-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/catalog"
          className="hover:text-foreground transition-colors"
        >
          Catalog
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

      {/* Main product section */}
      <div className="grid md:grid-cols-2 gap-12">
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
                src={product.image}
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
          {/* Category + tags */}
          <div className="space-y-2">
            {product.category && (
              <Link
                href={`/catalog?category=${product.category.slug}`}
                className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
          </div>

          {/* Price + stock */}
          <div className="flex items-end gap-4">
            <p className="text-4xl font-black text-primary">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <p className="text-sm pb-1.5">
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-medium">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-destructive font-medium">
                  Out of stock
                </span>
              )}
            </p>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Tags */}
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

          {/* Attributes */}
          {product.attributes.length > 0 && (
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Specifications
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

          {/* Quantity + CTA */}
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
                Subtotal:{" "}
                <span className="font-bold text-foreground">
                  ${(parseFloat(product.price) * quantity).toFixed(2)}
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
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Related products — same category */}
      <RelatedProducts
        categorySlug={product.category?.slug}
        currentSlug={product.slug}
      />

      {/* Recently viewed */}
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}
