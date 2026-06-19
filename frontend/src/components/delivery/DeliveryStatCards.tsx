"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Truck, CheckCircle, Package, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types";

interface Props {
  orders: Order[] | undefined;
  isLoading: boolean;
}

const STAT_STYLES = [
  { iconBg: "bg-blue-500",    accent: "#3b82f6", color: "text-blue-600" },
  { iconBg: "bg-amber-500",   accent: "#f59e0b", color: "text-amber-600" },
  { iconBg: "bg-emerald-500", accent: "#10b981", color: "text-emerald-600" },
  { iconBg: "bg-purple-500",  accent: "#a855f7", color: "text-purple-600" },
];

export default function DeliveryStatCards({ orders, isLoading }: Props) {
  const t = useTranslations("delivery");
  const { user } = useAuth();

  const active    = orders?.filter((o) => o.status !== "delivered") ?? [];
  const completed = orders?.filter((o) => o.status === "delivered") ?? [];
  const inTransit = orders?.filter((o) => o.status === "in_transit") ?? [];
  const total     = orders?.length ?? 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("greetingMorning") : hour < 18 ? t("greetingAfternoon") : t("greetingEvening");

  const stats = [
    { labelKey: "activeDeliveries", value: active.length,    icon: Truck,        href: "/delivery/active",    sub: t("inProgress") },
    { labelKey: "inTransit",        value: inTransit.length, icon: Clock,        href: "/delivery/active",    sub: t("onTheWay") },
    { labelKey: "completedToday",   value: completed.length, icon: CheckCircle,  href: "/delivery/completed", sub: t("delivered") },
    { labelKey: "totalAssigned",    value: total,            icon: Package,      href: "/delivery/active",    sub: t("totalAssignedSub") },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden px-7 py-6"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 80% 50%, #60a5fa 0%, transparent 60%)",
        }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-blue-400 text-sm font-medium mb-1">
              {greeting}{user?.username ? `, ${user.username}` : ""} 👋
            </p>
            <h1 className="text-2xl font-black text-white tracking-tight">{t("deliverySpace")}</h1>
            <p className="text-slate-400 text-sm mt-1">{t("todayDeliveries")}</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-right">
            <div>
              <p className="text-3xl font-black text-white">{isLoading ? "—" : active.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t("inProgress")}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-3xl font-black text-blue-400">{isLoading ? "—" : completed.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t("delivered")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const style = STAT_STYLES[i];
          return (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={stat.href} className="block group">
                <div className="relative rounded-2xl bg-white border border-slate-100 p-5 hover:border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-8 translate-x-8"
                    style={{ background: style.accent }} />
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl shadow-sm", style.iconBg)}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <ArrowUpRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity", style.color)} />
                  </div>
                  <p className="text-2xl font-black text-slate-900 leading-none">
                    {isLoading ? <span className="text-slate-300">—</span> : stat.value}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1.5">{t(stat.labelKey)}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{stat.sub}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
