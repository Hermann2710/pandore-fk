"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import WishlistButton from "@/components/shop/WishlistButton";
import type { Product } from "@/types";
import { toast } from "sonner";

interface Props { product: Product; index?: number; }

export default function ProductCard({ product, index = 0 }: Props) {
  const t = useTranslations("catalog");
  const addItem = useCartStore((s) => s.addItem);
  const { currency } = useCurrencyStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(t("addedToCart", { name: product.name }), { description: formatPrice(product.price, currency) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4 }} className="group"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {product.image
              ? <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              : <div className="flex h-full items-center justify-center"><Tag className="h-12 w-12 text-muted-foreground/30" /></div>
            }
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{t("outOfStock")}</span>
              </div>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <WishlistButton productId={product.id} size="sm" />
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              {product.category && (
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category.name}</p>
              )}
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="emerald" className="text-[10px]">{tag.name}</Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-lg font-bold text-primary">{formatPrice(product.price, currency)}</span>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button size="sm" variant="luxury" onClick={handleAddToCart} disabled={product.stock === 0} className="gap-1.5">
                  <ShoppingCart className="h-3.5 w-3.5" /> {t("add")}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
