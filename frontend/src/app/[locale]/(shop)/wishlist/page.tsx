"use client";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import WishlistProductCard from "@/components/shop/WishlistProductCard";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const t = useTranslations("wishlist");
  const { data: wishlist, isLoading } = useWishlist();
  const products = wishlist?.products ?? [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {products.length !== 1
            ? t("savedItemsPlural", { count: products.length })
            : t("savedItems", { count: products.length })}
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
          <h2 className="text-xl font-bold mb-2">{t("empty")}</h2>
          <p className="text-muted-foreground mb-6">{t("emptyDescription")}</p>
          <Button variant="luxury" asChild>
            <Link href="/catalog">{t("browseCatalog")}</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence>
            {products.map((product, i) => (
              <WishlistProductCard key={product.id} product={product} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
