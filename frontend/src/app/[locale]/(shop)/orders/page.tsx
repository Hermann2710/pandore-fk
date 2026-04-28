"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OrderCard from "@/components/shop/OrderCard";
import { useMyOrders } from "@/hooks/useOrders";
import { Link } from "@/i18n/navigation";

export default function OrdersPage() {
  const t = useTranslations("orders");
  const { data: orders, isLoading } = useMyOrders();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : orders?.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 text-center">
          <Package className="h-14 w-14 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-medium">{t("noOrders")}</p>
          <Button variant="luxury" className="mt-4" asChild>
            <Link href="/catalog">{t("startShopping")}</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders?.map((order, i) => <OrderCard key={order.id} order={order} index={i} />)}
        </div>
      )}
    </div>
  );
}
