"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Truck, CheckCircle, Package, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { Order } from "@/types";

interface Props {
  orders: Order[] | undefined;
  isLoading: boolean;
}

export default function DeliveryStatCards({ orders, isLoading }: Props) {
  const t = useTranslations("delivery");

  const active    = orders?.filter((o) => o.status !== "delivered") ?? [];
  const completed = orders?.filter((o) => o.status === "delivered") ?? [];
  const inTransit = orders?.filter((o) => o.status === "in_transit") ?? [];

  const stats = [
    { labelKey: "activeDeliveries", value: active.length,       icon: Truck,       color: "text-blue-500",    bg: "bg-blue-50",    href: "/delivery/active" },
    { labelKey: "inTransit",        value: inTransit.length,    icon: Clock,       color: "text-amber-500",   bg: "bg-amber-50",   href: "/delivery/active" },
    { labelKey: "completedToday",   value: completed.length,    icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", href: "/delivery/completed" },
    { labelKey: "totalAssigned",    value: orders?.length ?? 0, icon: Package,     color: "text-purple-500",  bg: "bg-purple-50",  href: "/delivery/active" },
  ] as const;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.labelKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <Link href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl p-3 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{isLoading ? "—" : stat.value}</p>
                  <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
