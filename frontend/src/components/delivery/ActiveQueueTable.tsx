"use client";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ArrowRight, Package, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

interface Props {
  orders: Order[] | undefined;
  isLoading: boolean;
}

function StatusPill({ status }: { status: string }) {
  const t = useTranslations("orders");
  const COLORS: Record<string, { color: string; bg: string; dot: string }> = {
    assigned:   { color: "text-blue-700",   bg: "bg-blue-50",   dot: "bg-blue-400" },
    picked_up:  { color: "text-violet-700", bg: "bg-violet-50", dot: "bg-violet-400" },
    in_transit: { color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-400" },
    delivered:  { color: "text-emerald-700",bg: "bg-emerald-50",dot: "bg-emerald-500" },
  };
  const cfg = COLORS[status] ?? { color: "text-slate-700", bg: "bg-slate-50", dot: "bg-slate-400" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", cfg.bg, cfg.color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {t(`status.${status as keyof ReturnType<typeof t>}` as any)}
    </span>
  );
}

export default function ActiveQueueTable({ orders, isLoading }: Props) {
  const t = useTranslations("delivery");
  const active = orders?.filter((o) => o.status !== "delivered") ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 flex items-center gap-2.5 text-[15px]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
            <Truck className="h-3.5 w-3.5 text-white" />
          </span>
          {t("activeDeliveriesTitle")}
        </h2>
        <Link
          href="/delivery/active"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
        >
          {t("viewAll")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center rounded-2xl border border-slate-100 bg-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 mb-3">
            <Truck className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-500">{t("noActiveQueue")}</p>
          <p className="text-xs text-slate-400 mt-1">{t("noDeliveriesHint")}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {["#", t("tableCustomer"), t("tableAddress"), t("tableStatus"), t("tableItems")].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {active.slice(0, 5).map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">#{order.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs shrink-0">
                          {order.customer.username[0].toUpperCase()}
                        </div>
                        <span className="text-slate-700 font-medium text-xs">{order.customer.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 max-w-48">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-500 truncate">{order.shipping_address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 font-medium">
                        <Package className="h-3 w-3" />
                        {order.items.length}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
