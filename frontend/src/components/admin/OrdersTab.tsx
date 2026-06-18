"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Eye, Package, MapPin, Calendar, User,
  Truck, ClipboardList, Hash, CreditCard,
} from "lucide-react";
import Image from "next/image";
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
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

const STATUS_VARIANT: Record<Order["status"], string> = {
  pending: "pending", assigned: "assigned", picked_up: "picked_up",
  in_transit: "in_transit", delivered: "delivered", cancelled: "cancelled",
};

const STATUS_LABELS: Record<Order["status"], { label: string; color: string; bg: string; dot: string }> = {
  pending:    { label: "En attente",  color: "text-amber-700",   bg: "bg-amber-50",   dot: "bg-amber-400" },
  assigned:   { label: "Assignée",    color: "text-blue-700",    bg: "bg-blue-50",    dot: "bg-blue-400" },
  picked_up:  { label: "Récupérée",   color: "text-violet-700",  bg: "bg-violet-50",  dot: "bg-violet-400" },
  in_transit: { label: "En transit",  color: "text-orange-700",  bg: "bg-orange-50",  dot: "bg-orange-400" },
  delivered:  { label: "Livrée",      color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  cancelled:  { label: "Annulée",     color: "text-red-700",     bg: "bg-red-50",     dot: "bg-red-400" },
};

function StatusPill({ status }: { status: Order["status"] }) {
  const cfg = STATUS_LABELS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", cfg.bg, cfg.color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

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

function OrderDetailDialog({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const { currency } = useCurrencyStore();
  const cfg = STATUS_LABELS[order.status];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 h-8">
          <Eye className="h-3.5 w-3.5" /> Détails
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 block">
        {/* Header */}
        <div className="px-6 py-5 border-b bg-slate-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
                <ClipboardList className="h-4 w-4 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Commande #{order.id}
                </DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <StatusPill status={order.status} />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer + address */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 p-4 space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Client
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm shrink-0">
                  {order.customer.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{order.customer.username}</p>
                  <p className="text-xs text-slate-500">{order.customer.email}</p>
                  {order.customer.phone && (
                    <p className="text-xs text-slate-500">{order.customer.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 p-4 space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Adresse de livraison
              </p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {order.shipping_address || "—"}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Articles ({order.items.length})
              </p>
            </div>
            <div className="divide-y divide-slate-50">
              {order.items.map((item) => {
                const imgUrl = item.product.image
                  ? item.product.image.startsWith("http")
                    ? item.product.image
                    : `http://localhost:8000${item.product.image}`
                  : null;
                return (
                  <div key={item.id} className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {imgUrl
                        ? <Image src={imgUrl} alt={item.product.name} width={48} height={48} className="object-cover w-full h-full" />
                        : <Package className="h-5 w-5 text-slate-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.product.name}</p>
                      {item.product.category && (
                        <p className="text-xs text-slate-400">{item.product.category.name}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-800">{formatPrice(item.subtotal, currency)}</p>
                      <p className="text-xs text-slate-400">
                        {item.quantity} × {formatPrice(item.unit_price, currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Total */}
            <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Total commande</p>
              <p className="text-lg font-black text-slate-900">{formatPrice(order.total_price, currency)}</p>
            </div>
          </div>

          {/* Delivery assignment */}
          {order.assignment && (
            <div className="rounded-xl border border-slate-100 p-4 space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Livreur assigné
              </p>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                  {order.assignment.delivery_man.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{order.assignment.delivery_man.username}</p>
                  {order.assignment.delivery_man.phone && (
                    <p className="text-xs text-slate-500">{order.assignment.delivery_man.phone}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Assigné le {new Date(order.assignment.assigned_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                  {order.assignment.notes && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                      {order.assignment.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Hash className="h-3 w-3" /> ID Commande
              </p>
              <p className="text-sm font-bold text-slate-700">#{order.id}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <CreditCard className="h-3 w-3" /> Statut
              </p>
              <span className={cn("text-xs font-bold", cfg.color)}>{cfg.label}</span>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3" /> Créée le
              </p>
              <p className="text-xs font-semibold text-slate-700">
                {new Date(order.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3" /> Mise à jour
              </p>
              <p className="text-xs font-semibold text-slate-700">
                {new Date(order.updated_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
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
    <div className="space-y-5">
      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <Button
            key={s}
            variant={statusFilter === (s === "all" ? "" : s) ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s === "all" ? "" : s)}
            className="capitalize text-xs"
          >
            {s === "all" ? "Tout" : to(`status.${s as Order["status"]}`)}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {["#", t("colCustomer"), t("colItems"), t("colTotal"), t("colStatus"), t("colAssignedTo"), t("colDate"), ""].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {orders?.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">#{order.id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs shrink-0">
                          {order.customer.username[0].toUpperCase()}
                        </div>
                        <span className="text-slate-700 font-medium text-xs">{order.customer.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 font-medium">
                        <Package className="h-3 w-3" />
                        {order.items.length}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600 text-sm">
                      {formatPrice(order.total_price, currency)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">
                      {order.assignment?.delivery_man.username ?? (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <OrderDetailDialog order={order} />
                        {(order.status === "pending" || order.status === "assigned") && (
                          <AssignDialog order={order} />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {orders?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 mb-3">
                <ClipboardList className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">{t("noOrders")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
