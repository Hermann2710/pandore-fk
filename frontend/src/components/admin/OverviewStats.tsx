"use client";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  TrendingUp, ClipboardList, Package, ShoppingBag, Users,
  ArrowRight, CheckCircle2, Clock, Truck, ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ordersApi, adminCatalogApi, authApi } from "@/lib/api";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { useAuth } from "@/context/AuthContext";

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string; bar: string }> = {
  pending:    { color: "text-amber-700",   bg: "bg-amber-50",    dot: "bg-amber-400",   bar: "bg-amber-400" },
  assigned:   { color: "text-blue-700",    bg: "bg-blue-50",     dot: "bg-blue-400",    bar: "bg-blue-400" },
  picked_up:  { color: "text-violet-700",  bg: "bg-violet-50",   dot: "bg-violet-400",  bar: "bg-violet-400" },
  in_transit: { color: "text-orange-700",  bg: "bg-orange-50",   dot: "bg-orange-400",  bar: "bg-orange-400" },
  delivered:  { color: "text-emerald-700", bg: "bg-emerald-50",  dot: "bg-emerald-500", bar: "bg-emerald-500" },
  cancelled:  { color: "text-red-700",     bg: "bg-red-50",      dot: "bg-red-400",     bar: "bg-red-400" },
};

function StatusBadge({ status }: { status: string }) {
  const to = useTranslations("orders");
  const cfg = STATUS_CONFIG[status] ?? { color: "text-slate-700", bg: "bg-slate-50", dot: "bg-slate-400", bar: "" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", cfg.bg, cfg.color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {to(`status.${status}` as any)}
    </span>
  );
}

const STAT_STYLES = [
  { color: "text-emerald-600", iconBg: "bg-emerald-500", accent: "#10b981" },
  { color: "text-blue-600",    iconBg: "bg-blue-500",    accent: "#3b82f6" },
  { color: "text-orange-500",  iconBg: "bg-orange-500",  accent: "#f97316" },
  { color: "text-purple-600",  iconBg: "bg-purple-500",  accent: "#a855f7" },
  { color: "text-rose-600",    iconBg: "bg-rose-500",    accent: "#f43f5e" },
];

export default function OverviewStats() {
  const t  = useTranslations("admin");
  const { currency } = useCurrencyStore();
  const { user } = useAuth();

  const { data: allOrders } = useQuery({ queryKey: ["admin-orders", ""], queryFn: () => ordersApi.adminOrders().then((r) => r.data) });
  const { data: products }  = useQuery({ queryKey: ["admin-products", ""], queryFn: () => adminCatalogApi.products().then((r) => r.data) });
  const { data: allUsers }  = useQuery({ queryKey: ["admin-users"], queryFn: () => authApi.adminUsers().then((r) => r.data) });

  const revenue   = allOrders?.filter((o) => o.status === "delivered").reduce((s, o) => s + parseFloat(o.total_price), 0) ?? 0;
  const pending   = allOrders?.filter((o) => o.status === "pending").length ?? 0;
  const transit   = allOrders?.filter((o) => o.status === "in_transit").length ?? 0;
  const delivered = allOrders?.filter((o) => o.status === "delivered").length ?? 0;
  const total     = allOrders?.length ?? 0;

  const hour = new Date().getHours();
  const greetingText = hour < 12 ? t("greetingMorning" as any) : hour < 18 ? t("greetingAfternoon" as any) : t("greetingEvening" as any);

  const stats = [
    { label: t("totalRevenue"), value: formatPrice(revenue, currency), icon: TrendingUp,   sub: delivered > 0 ? t("deliveredCount", { count: delivered }) : t("noneDelivered") },
    { label: t("totalOrders"),  value: total,                          icon: ClipboardList, sub: pending > 0 ? t("pendingCount", { count: pending }) : t("nonePending") },
    { label: t("inDelivery"),   value: transit,                        icon: Truck,         sub: transit > 0 ? t("inTransitSub") : t("noInTransit") },
    { label: t("products"),     value: products?.length ?? 0,          icon: ShoppingBag,   sub: t("activeProductsSub") },
    { label: t("users"),        value: allUsers?.length ?? 0,          icon: Users,         sub: t("registeredAccounts") },
  ];

  const statusBreakdown = Object.entries(
    (allOrders ?? []).reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden px-7 py-6"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)" }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 80% 50%, #34d399 0%, transparent 60%)",
        }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-emerald-400 text-sm font-medium mb-1">
            {greetingText}{user?.username ? `, ${user.username}` : ""} 👋
            </p>
            <h1 className="text-2xl font-black text-white tracking-tight">{t("dashboard")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t("storeOverview")}</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-right">
            <div>
              <p className="text-3xl font-black text-white">{total}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t("totalOrdersSub")}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-3xl font-black text-emerald-400">{formatPrice(revenue, currency)}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t("totalRevenueSub")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const style = STAT_STYLES[i];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group relative rounded-2xl bg-white border border-slate-100 p-5 hover:border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-8 translate-x-8"
                style={{ background: style.accent }} />
              <div className="flex items-start justify-between mb-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shadow-sm", style.iconBg)}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <ArrowUpRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity", style.color)} />
              </div>
              <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 mt-1.5">{stat.label}</p>
              <p className="text-[11px] text-slate-400 mt-1">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="font-bold text-slate-900 flex items-center gap-2.5 text-[15px]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
                <ClipboardList className="h-3.5 w-3.5 text-white" />
              </span>
              {t("recentOrders")}
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50"
            >
              {t("viewAll")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {(allOrders?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                <Package className="h-7 w-7 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">{t("noOrdersYet")}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/70">
                  {["#", t("customer"), t("total"), t("status"), t("date")].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allOrders?.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-700 text-xs">#{order.id}</td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">{order.customer.username}</td>
                    <td className="px-6 py-3.5 font-bold text-emerald-600">{formatPrice(order.total_price, currency)}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-3.5 text-slate-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Status breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl border border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2.5 text-[15px]">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </span>
                {t("statusBreakdown")}
              </h2>
            </div>
            <div className="p-5 space-y-3.5">
              {total === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">{t("noOrders")}</p>
              ) : (
                statusBreakdown.map(([status, count]) => {
                  const cfg = STATUS_CONFIG[status] ?? { dot: "bg-slate-400", bar: "bg-slate-400" };
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={status} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} />
                          <StatusBadge status={status} />
                        </span>
                        <span className="text-xs font-bold text-slate-500">{count} <span className="font-normal text-slate-300">({pct}%)</span></span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                          className={cn("h-full rounded-full", cfg.bar)}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Quick access */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}
            className="rounded-2xl border border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("quickAccess")}</p>
            </div>
            <div className="p-3 space-y-1">
              {[
                { labelKey: "pendingOrders",   href: "/admin/orders?status=pending",    icon: Clock, color: "text-amber-500",  bg: "bg-amber-50" },
                { labelKey: "inTransitOrders", href: "/admin/orders?status=in_transit", icon: Truck, color: "text-orange-500", bg: "bg-orange-50" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 group"
                >
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-colors", link.bg)}>
                    <link.icon className={cn("h-3.5 w-3.5", link.color)} />
                  </span>
                  <span className="flex-1 text-xs font-medium">{t(link.labelKey as any)}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
