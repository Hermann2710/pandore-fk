"use client";
import { motion } from "framer-motion";
import type { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MapPin, Clock } from "lucide-react";

// Maps order status to a human-readable label and badge variant
const STATUS_CONFIG: Record<
  Order["status"],
  { label: string; variant: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled"; progress: number }
> = {
  pending:    { label: "Pending",    variant: "pending",    progress: 10 },
  assigned:   { label: "Assigned",   variant: "assigned",   progress: 30 },
  picked_up:  { label: "Picked Up",  variant: "picked_up",  progress: 55 },
  in_transit: { label: "In Transit", variant: "in_transit", progress: 75 },
  delivered:  { label: "Delivered",  variant: "delivered",  progress: 100 },
  cancelled:  { label: "Cancelled",  variant: "cancelled",  progress: 0 },
};

interface Props {
  order: Order;
  index?: number;
}

export default function OrderCard({ order, index = 0 }: Props) {
  const config = STATUS_CONFIG[order.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Order #{order.id}
            </CardTitle>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{order.shipping_address}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>

          {/* Items summary */}
          <div className="text-sm space-y-1">
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex justify-between text-muted-foreground">
                <span className="truncate">{item.product?.name ?? "Deleted product"} ×{item.quantity}</span>
                <span>${item.subtotal}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-muted-foreground">+{order.items.length - 2} more items</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-primary font-bold">${order.total_price}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
