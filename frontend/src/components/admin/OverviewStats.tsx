"use client";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, ClipboardList, Package, ShoppingBag, Users, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ordersApi, adminCatalogApi, authApi } from "@/lib/api";
import { useCurrencyStore, formatPrice } from "@/store/currency";

export default function OverviewStats() {
  const t = useTranslations("admin");
  const to = useTranslations("orders");
  const { currency } = useCurrencyStore();

  const { data: allOrders } = useQuery({ queryKey: ["admin-orders", ""], queryFn: () => ordersApi.adminOrders().then((r) => r.data) });
  const { data: products }  = useQuery({ queryKey: ["admin-products", ""], queryFn: () => adminCatalogApi.products().then((r) => r.data) });
  const { data: allUsers }  = useQuery({ queryKey: ["admin-users"], queryFn: () => authApi.adminUsers().then((r) => r.data) });
  const { data: tags }      = useQuery({ queryKey: ["admin-tags"], queryFn: () => adminCatalogApi.tags().then((r) => r.data) });

  const revenue = allOrders?.filter((o) => o.status === "delivered").reduce((s, o) => s + parseFloat(o.total_price), 0) ?? 0;

  const stats = [
    { labelKey: "totalRevenue",   value: formatPrice(revenue, currency),                                          icon: TrendingUp,    color: "text-emerald-500", bg: "bg-emerald-50" },
    { labelKey: "totalOrders",    value: allOrders?.length ?? 0,                                                  icon: ClipboardList, color: "text-blue-500",    bg: "bg-blue-50" },
    { labelKey: "pendingOrders",  value: allOrders?.filter((o) => o.status === "pending").length ?? 0,            icon: Package,       color: "text-amber-500",   bg: "bg-amber-50" },
    { labelKey: "products",       value: products?.length ?? 0,                                                   icon: ShoppingBag,   color: "text-purple-500",  bg: "bg-purple-50" },
    { labelKey: "users",          value: allUsers?.length ?? 0,                                                   icon: Users,         color: "text-rose-500",    bg: "bg-rose-50" },
    { labelKey: "tags",           value: tags?.length ?? 0,                                                       icon: Tag,           color: "text-cyan-500",    bg: "bg-cyan-50" },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.labelKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn("rounded-xl p-3", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">{t("recentOrders")}</h2>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {(["#", t("customer"), t("total"), t("status"), t("date")] as string[]).map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allOrders?.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.customer.username}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatPrice(order.total_price, currency)}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{to(`status.${order.status}`)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(allOrders?.length ?? 0) === 0 && (
            <p className="text-center py-10 text-muted-foreground">{t("noOrdersYet")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
