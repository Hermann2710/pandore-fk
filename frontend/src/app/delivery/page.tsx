"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, CheckCircle, ArrowRight, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";
import type { Order } from "@/types";

// The delivery journey — each step has a progress value and a CTA label
const DELIVERY_STEPS: Record<string, { progress: number; next: string; cta: string }> = {
  assigned:   { progress: 25,  next: "picked_up",  cta: "Mark as Picked Up" },
  picked_up:  { progress: 55,  next: "in_transit", cta: "Start Delivery" },
  in_transit: { progress: 80,  next: "delivered",  cta: "Mark as Delivered" },
  delivered:  { progress: 100, next: "",            cta: "Completed" },
};

function DeliveryOrderCard({ order, index }: { order: Order; index: number }) {
  const queryClient = useQueryClient();
  const step = DELIVERY_STEPS[order.status];

  const { mutate: advance, isPending } = useMutation({
    mutationFn: () => ordersApi.updateStatus(order.id),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-queue"] });
      toast.success(`Order #${order.id} → ${data.status.replace("_", " ")}`, {
        icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
      });
    },
    onError: () => toast.error("Status update failed"),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      layout
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Colored top bar based on progress */}
        <div
          className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-700"
          style={{ width: `${step?.progress ?? 0}%` }}
        />

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Order #{order.id}
            </CardTitle>
            <Badge variant={order.status as any} className="capitalize">
              {order.status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Customer info */}
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{order.customer.username}</p>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{order.shipping_address}</span>
          </div>

          {/* Items */}
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                <span>{item.product?.name} ×{item.quantity}</span>
                <span>${item.subtotal}</span>
              </div>
            ))}
          </div>

          {/* Delivery notes */}
          {order.assignment?.notes && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              <span className="font-medium">Note: </span>{order.assignment.notes}
            </div>
          )}

          {/* Progress bar */}
          {step && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Delivery progress</span>
                <span>{step.progress}%</span>
              </div>
              <Progress value={step.progress} />
            </div>
          )}

          {/* CTA button */}
          {step && step.next && (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                variant="luxury"
                className="w-full gap-2"
                onClick={() => advance()}
                disabled={isPending}
              >
                {isPending ? "Updating…" : step.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {order.status === "delivered" && (
            <div className="flex items-center justify-center gap-2 py-2 text-emerald-600 font-medium text-sm">
              <CheckCircle className="h-5 w-5" />
              Delivered successfully
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DeliveryDashboard() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["delivery-queue"],
    queryFn: () => ordersApi.deliveryQueue().then((r) => r.data),
    refetchInterval: 30_000, // Poll every 30s — keeps the queue fresh
  });

  const active = orders?.filter((o) => o.status !== "delivered") ?? [];
  const completed = orders?.filter((o) => o.status === "delivered") ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My <span className="text-primary">Queue</span></h1>
            <p className="text-muted-foreground text-sm">
              {active.length} active · {completed.length} completed today
            </p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : orders?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-24 text-center"
        >
          <Truck className="h-14 w-14 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-medium">No deliveries assigned yet</p>
          <p className="text-sm text-muted-foreground mt-1">Check back soon — the admin will assign orders to you</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Active deliveries */}
          {active.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Active Deliveries
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {active.map((order, i) => (
                    <DeliveryOrderCard key={order.id} order={order} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Completed
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
                {completed.map((order, i) => (
                  <DeliveryOrderCard key={order.id} order={order} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
