"use client";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUpdateDeliveryStatus } from "@/hooks/useOrders";
import type { Order } from "@/types";

const DELIVERY_STEPS: Record<string, { progress: number; next: string; cta: string }> = {
  assigned:   { progress: 25,  next: "picked_up",  cta: "Mark as Picked Up" },
  picked_up:  { progress: 55,  next: "in_transit", cta: "Start Delivery" },
  in_transit: { progress: 80,  next: "delivered",  cta: "Mark as Delivered" },
  delivered:  { progress: 100, next: "",            cta: "Completed" },
};

interface Props { order: Order; index: number; }

export default function DeliveryOrderCard({ order, index }: Props) {
  const step = DELIVERY_STEPS[order.status];
  const { mutate: advance, isPending } = useUpdateDeliveryStatus();

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} layout>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-700" style={{ width: `${step?.progress ?? 0}%` }} />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-primary" />Order #{order.id}</CardTitle>
            <Badge variant={order.status as any} className="capitalize">{order.status.replace("_", " ")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-medium">{order.customer.username}</p>
          <div className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground">{order.shipping_address}</span></div>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                <span>{item.product?.name} ×{item.quantity}</span><span>${item.subtotal}</span>
              </div>
            ))}
          </div>
          {order.assignment?.notes && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800"><span className="font-medium">Note: </span>{order.assignment.notes}</div>
          )}
          {step && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{step.progress}%</span></div>
              <Progress value={step.progress} />
            </div>
          )}
          {step?.next && (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button variant="luxury" className="w-full gap-2" onClick={() => advance(order.id)} disabled={isPending}>
                {isPending ? "Updating…" : step.cta}<ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
          {order.status === "delivered" && (
            <div className="flex items-center justify-center gap-2 py-2 text-emerald-600 font-medium text-sm"><CheckCircle className="h-5 w-5" />Delivered successfully</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
