"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { useToggleWishlist } from "@/hooks/useWishlist";
import { mediaUrl } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types";

interface Props { product: Product; index: number; }

export default function WishlistProductCard({ product, index }: Props) {
  const t  = useTranslations("wishlist");
  const tc = useTranslations("catalog");
  const addItem = useCartStore((s) => s.addItem);
  const { currency } = useCurrencyStore();
  const { mutate: toggle } = useToggleWishlist();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.06 }}
      className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image
            ? <Image src={mediaUrl(product.image)!} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            : <div className="flex h-full items-center justify-center"><Package className="h-12 w-12 text-muted-foreground/20" /></div>
          }
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{tc("outOfStock")}</span>
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

        <p className="text-lg font-bold text-primary">{formatPrice(product.price, currency)}</p>

        <div className="flex gap-2">
          <Button
            size="sm" variant="luxury" className="flex-1 gap-1.5"
            disabled={product.stock === 0}
            onClick={() => { addItem(product); toast.success(t("addedToCart", { name: product.name })); }}
          >
            <ShoppingCart className="h-3.5 w-3.5" /> {tc("addToCart")}
          </Button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => toggle(product.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
            title={t("removeFromWishlist")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
