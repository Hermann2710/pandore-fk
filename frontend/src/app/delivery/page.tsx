"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DeliveryOrderCard from "@/components/delivery/DeliveryOrderCard";
import { useDeliveryQueue } from "@/hooks/useOrders";

export default function DeliveryDashboard() {
  const { data: orders, isLoading } = useDeliveryQueue();
  const active    = orders?.filter((o) => o.status !== "delivered") ?? [];
  const completed = orders?.filter((o) => o.status === "delivered") ?? [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My <span className="text-primary">Queue</span></h1>
            <p className="text-muted-foreground text-sm">{active.length} active · {completed.length} completed</p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : orders?.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 text-center">
          <Truck className="h-14 w-14 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-medium">No deliveries assigned yet</p>
          <p className="text-sm text-muted-foreground mt-1">The admin will assign orders to you shortly</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Active Deliveries
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {active.map((order, i) => <DeliveryOrderCard key={order.id} order={order} index={i} />)}
                </AnimatePresence>
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Completed
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
                {completed.map((order, i) => <DeliveryOrderCard key={order.id} order={order} index={i} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
