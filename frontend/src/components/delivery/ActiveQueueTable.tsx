"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { Order } from "@/types";

interface Props {
  orders: Order[] | undefined;
  isLoading: boolean;
}

export default function ActiveQueueTable({ orders, isLoading }: Props) {
  const t = useTranslations("delivery");
  const to = useTranslations("orders");

  const active = orders?.filter((o) => o.status !== "delivered") ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("activeDeliveriesTitle")}</h2>
        <Link
          href="/delivery/active"
          className="text-sm text-primary hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center rounded-xl border bg-card">
          <Truck className="h-12 w-12 text-muted-foreground/20 mb-3" />
          <p className="font-medium">{t("noActiveQueue")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("noDeliveriesHint")}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {[
                  "#",
                  t("tableCustomer"),
                  t("tableAddress"),
                  t("tableStatus"),
                  t("tableItems"),
                ].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {active.slice(0, 5).map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.customer.username}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-50">
                    {order.shipping_address}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={order.status as Order["status"]}
                      className="capitalize"
                    >
                      {to(`status.${order.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.items.length}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
