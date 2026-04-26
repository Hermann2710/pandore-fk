"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();
  const { mutate: toggle } = useToggleWishlist();
  const addItem = useCartStore((s) => s.addItem);

  const products = wishlist?.products ?? [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
          My <span className="text-primary">Wishlist</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          {products.length} saved item{products.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/20 mb-6" />
          <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save products you love to find them later</p>
          <Button variant="luxury" asChild>
            <Link href="/catalog">Browse Catalog</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence>
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.06 }}
                className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground/20" />
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <div>
                    {product.category && (
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category.name}</p>
                    )}
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="emerald" className="text-[10px]">{tag.name}</Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-lg font-bold text-primary">${parseFloat(product.price).toFixed(2)}</p>

                  <div className="flex gap-2">
                    <Button
                      size="sm" variant="luxury" className="flex-1 gap-1.5"
                      disabled={product.stock === 0}
                      onClick={() => { addItem(product); toast.success(`${product.name} added to cart`); }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                    </Button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggle(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
