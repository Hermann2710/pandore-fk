"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrders, useAssignOrder } from "@/hooks/useOrders";
import { useDeliveryPersonnel } from "@/hooks/useAuth";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import type { Order } from "@/types";

const STATUS_VARIANT: Record<Order["status"], string> = {
  pending: "pending", assigned: "assigned", picked_up: "picked_up",
  in_transit: "in_transit", delivered: "delivered", cancelled: "cancelled",
};

function AssignDialog({ order }: { order: Order }) {
  const t = useTranslations("adminTabs.orders");
  const [open, setOpen] = useState(false);
  const [deliveryManId, setDeliveryManId] = useState("");
  const [notes, setNotes] = useState("");
  const { data: personnel } = useDeliveryPersonnel();
  const { mutate: assign, isPending } = useAssignOrder();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="luxury" className="gap-1.5">
          <Users className="h-3.5 w-3.5" /> {t("assign")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{t("assignTitle", { id: order.id })}</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>{t("deliveryPersonnel")}</Label>
            <Select value={deliveryManId} onValueChange={setDeliveryManId}>
              <SelectTrigger><SelectValue placeholder={t("selectDelivery")} /></SelectTrigger>
              <SelectContent>
                {personnel?.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.username}{p.phone ? ` — ${p.phone}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("notesOptional")}</Label>
            <Input placeholder={t("notesPlaceholder")} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button variant="luxury" className="w-full" disabled={!deliveryManId || isPending}
            onClick={() => assign({ orderId: order.id, data: { delivery_man_id: parseInt(deliveryManId), notes } }, { onSuccess: () => setOpen(false) })}>
            {isPending ? t("assigning") : t("confirmAssignment")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersTab() {
  const t = useTranslations("adminTabs.orders");
  const to = useTranslations("orders");
  const { currency } = useCurrencyStore();
  const [statusFilter, setStatusFilter] = useState("pending");
  const { data: orders, isLoading } = useAdminOrders(statusFilter || undefined);
  const statuses = ["all", "pending", "assigned", "picked_up", "in_transit", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <Button key={s} variant={statusFilter === (s === "all" ? "" : s) ? "default" : "outline"} size="sm"
            onClick={() => setStatusFilter(s === "all" ? "" : s)} className="capitalize">
            {s === "all" ? to("title").split(" ")[0] : to(`status.${s as Order["status"]}`)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>{[t("colOrder"), t("colCustomer"), t("colItems"), t("colTotal"), t("colStatus"), t("colAssignedTo"), t("colDate"), t("colAction")].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {orders?.map((order, i) => (
                  <motion.tr key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.customer.username}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.items.length}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatPrice(order.total_price, currency)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[order.status] as any} className="capitalize">
                        {to(`status.${order.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{order.assignment?.delivery_man.username ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{(order.status === "pending" || order.status === "assigned") && <AssignDialog order={order} />}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {orders?.length === 0 && <p className="text-center py-12 text-muted-foreground">{t("noOrders")}</p>}
        </div>
      )}
    </div>
  );
}
