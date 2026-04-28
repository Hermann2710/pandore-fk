"use client";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import { Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DeliveryOrderCard from "@/components/delivery/DeliveryOrderCard";
import { useDeliveryQueue } from "@/hooks/useOrders";

export default function ActiveDeliveriesPage() {
  const t = useTranslations("delivery");
  const { data: orders, isLoading } = useDeliveryQueue();
  const active = orders?.filter((o) => o.status !== "delivered") ?? [];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {t("active", { count: active.length })}
      </p>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : active.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Truck className="h-14 w-14 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-medium">{t("noDeliveries")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("noDeliveriesHint")}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {active.map((order, i) => <DeliveryOrderCard key={order.id} order={order} index={i} />)}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
