"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CartSummary() {
  const t = useTranslations("cart");
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice } = useCartStore();
  const { currency } = useCurrencyStore();

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-lg font-bold">{t("orderSummary")}</h2>

        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-muted-foreground">
              <span className="truncate">{item.product.name} ×{item.quantity}</span>
              <span>{formatPrice(parseFloat(item.product.price) * item.quantity, currency)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold text-base">
            <span>{t("total")}</span>
            <span className="text-primary">{formatPrice(totalPrice(), currency)}</span>
          </div>
        </div>

        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            variant="luxury"
            size="lg"
            className="w-full gap-2"
            onClick={() => router.push(user ? "/checkout" : "/login")}
          >
            {t("proceedToCheckout")} <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
