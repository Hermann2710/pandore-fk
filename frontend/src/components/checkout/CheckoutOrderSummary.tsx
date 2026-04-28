"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, MapPin, Package } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore, formatPrice } from "@/store/currency";

interface Props { shippingAddress: string; }

export default function CheckoutOrderSummary({ shippingAddress }: Props) {
  const t = useTranslations("checkout");
  const { items, totalPrice } = useCartStore();
  const { currency } = useCurrencyStore();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" /> {t("orderSummaryTitle")}
        </h2>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.product.image
                  ? <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                  : <div className="flex h-full items-center justify-center"><Package className="h-5 w-5 text-muted-foreground/40" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">×{item.quantity}</p>
              </div>
              <p className="text-sm font-semibold shrink-0">
                {formatPrice(parseFloat(item.product.price) * item.quantity, currency)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(totalPrice(), currency)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t("shipping")}</span>
            <span className="text-emerald-600 font-medium">{t("free")}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1 border-t">
            <span>{t("total")}</span>
            <span className="text-primary">{formatPrice(totalPrice(), currency)}</span>
          </div>
        </div>

        {shippingAddress && (
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-0.5 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {t("deliveryTo")}
            </p>
            {shippingAddress}
          </div>
        )}
      </div>
    </motion.div>
  );
}
