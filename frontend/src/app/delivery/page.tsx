"use client";
import { motion } from "framer-motion";
import { Truck, CheckCircle, Package, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useDeliveryQueue } from "@/hooks/useOrders";
import Link from "next/link";

export default function DeliveryOverview() {
  const { data: orders, isLoading } = useDeliveryQueue();

  const active    = orders?.filter((o) => o.status !== "delivered") ?? [];
  const completed = orders?.filter((o) => o.status === "delivered") ?? [];
  const inTransit = orders?.filter((o) => o.status === "in_transit") ?? [];

  const stats = [
    { label: "Active Deliveries", value: active.length,    icon: Truck,        color: "text-blue-500",    bg: "bg-blue-50",    href: "/delivery/active" },
    { label: "In Transit",        value: inTransit.length, icon: Clock,        color: "text-amber-500",   bg: "bg-amber-50",   href: "/delivery/active" },
    { label: "Completed Today",   value: completed.length, icon: CheckCircle,  color: "text-emerald-500", bg: "bg-emerald-50", href: "/delivery/completed" },
    { label: "Total Assigned",    value: orders?.length ?? 0, icon: Package,   color: "text-purple-500",  bg: "bg-purple-50",  href: "/delivery/active" },
  ];

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`rounded-xl p-3 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{isLoading ? "—" : stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent active orders preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Queue</h2>
          <Link href="/delivery/active" className="text-sm text-primary hover:underline">View all →</Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : active.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center rounded-xl border bg-card">
            <Truck className="h-12 w-12 text-muted-foreground/20 mb-3" />
            <p className="font-medium">No active deliveries</p>
            <p className="text-sm text-muted-foreground mt-1">The admin will assign orders to you shortly</p>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>{["Order", "Customer", "Address", "Status", "Items"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {active.slice(0, 5).map((order, i) => (
                  <motion.tr key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.customer.username}</td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{order.shipping_address}</td>
                    <td className="px-4 py-3">
                      <Badge variant={order.status as any} className="capitalize">{order.status.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{order.items.length}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
