"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { mediaUrl } from "@/lib/utils";
import type { CartItem } from "@/types";

interface Props { item: CartItem; }

export default function CartItemRow({ item }: Props) {
  const t = useTranslations("cart");
  const { removeItem, updateQuantity } = useCartStore();
  const { currency } = useCurrencyStore();

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
          {item.product.image
            ? <Image src={mediaUrl(item.product.image)!} alt={item.product.name} fill className="object-cover" />
            : <div className="h-full w-full bg-muted" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{item.product.name}</p>
          <p className="text-sm text-muted-foreground">
            {t("each", { price: formatPrice(item.product.price, currency) })}
          </p>
        </div>

        <div className="flex items-center border rounded-md overflow-hidden">
          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 hover:bg-muted text-sm">−</button>
          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 hover:bg-muted text-sm">+</button>
        </div>

        <p className="font-bold text-primary w-20 text-right">
          {formatPrice(parseFloat(item.product.price) * item.quantity, currency)}
        </p>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => removeItem(item.product.id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </CardContent>
    </Card>
  );
}
