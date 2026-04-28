"use client";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import CartItemRow from "@/components/shop/CartItemRow";
import CartSummary from "@/components/shop/CartSummary";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/20 mb-6" />
        <h2 className="text-2xl font-bold mb-2">{t("empty")}</h2>
        <p className="text-muted-foreground mb-6">{t("emptyDescription")}</p>
        <Button variant="luxury" asChild>
          <Link href="/catalog">{t("browseCatalog")}</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
        {t("title")}
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div key={item.product.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }} transition={{ delay: i * 0.05 }}>
                <CartItemRow item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <CartSummary />
        </motion.div>
      </div>
    </div>
  );
}
