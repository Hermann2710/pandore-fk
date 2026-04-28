"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MapPin, Clock, XCircle } from "lucide-react";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { useCancelOrder } from "@/hooks/useOrders";

const STATUS_VARIANTS: Record<Order["status"], "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled"> = {
  pending: "pending", assigned: "assigned", picked_up: "picked_up",
  in_transit: "in_transit", delivered: "delivered", cancelled: "cancelled",
};

interface Props { order: Order; index?: number; }

export default function OrderCard({ order, index = 0 }: Props) {
  const t = useTranslations("orders");
  const { currency } = useCurrencyStore();
  const { mutate: cancel, isPending: cancelling } = useCancelOrder();

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              {t("order", { id: order.id })}
            </CardTitle>
            <Badge variant={STATUS_VARIANTS[order.status]}>
              {t(`status.${order.status}`)}
            </Badge>
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
          <div className="text-sm space-y-1">
            {order.items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex justify-between text-muted-foreground">
                <span className="truncate">{item.product?.name ?? "Deleted product"} ×{item.quantity}</span>
                <span>{formatPrice(item.subtotal, currency)}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-muted-foreground">+{order.items.length - 2} more items</p>
            )}
          </div>
          <div className="flex items-center justify-between pt-1 border-t">
            <span className="text-sm font-semibold">{t("total")}</span>
            <span className="text-primary font-bold">{formatPrice(order.total_price, currency)}</span>
          </div>
          {order.status === "pending" && (
            <Button variant="outline" size="sm"
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/5 gap-1.5"
              disabled={cancelling}
              onClick={() => { if (confirm(t("confirmCancel", { id: order.id }))) cancel(order.id); }}>
              <XCircle className="h-4 w-4" />
              {cancelling ? t("cancelling") : t("cancelOrder")}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
