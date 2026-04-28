"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DeliveryOrderCard from "@/components/delivery/DeliveryOrderCard";
import { useDeliveryQueue } from "@/hooks/useOrders";

export default function CompletedDeliveriesPage() {
  const t = useTranslations("delivery");
  const { data: orders, isLoading } = useDeliveryQueue();
  const completed = orders?.filter((o) => o.status === "delivered") ?? [];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {t("completedCount", { count: completed.length })}
      </p>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : completed.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <CheckCircle className="h-14 w-14 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-medium">{t("completed")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("noDeliveriesHint")}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-80">
          {completed.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <DeliveryOrderCard order={order} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
