"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Package, MapPin, User, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUpdateDeliveryStatus } from "@/hooks/useOrders";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

const STEPS = [
  { key: "assigned",   label: "Assignée" },
  { key: "picked_up", label: "Récupérée" },
  { key: "in_transit", label: "En transit" },
  { key: "delivered", label: "Livrée" },
] as const;

const STEP_INDEX: Record<string, number> = {
  assigned: 0, picked_up: 1, in_transit: 2, delivered: 3,
};

const CTA_KEYS: Record<string, string> = {
  assigned:   "markPickedUp",
  picked_up:  "startDelivery",
  in_transit: "markDelivered",
};

interface Props { order: Order; index: number; }

export default function DeliveryOrderCard({ order, index }: Props) {
  const t = useTranslations("delivery");
  const to = useTranslations("orders");
  const { currency } = useCurrencyStore();
  const { mutate: advance, isPending } = useUpdateDeliveryStatus();
  const stepIdx = STEP_INDEX[order.status] ?? 0;
  const isDelivered = order.status === "delivered";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      layout
      className="rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Top progress bar */}
      <div className="h-1 bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isDelivered ? "100%" : `${(stepIdx / 3) * 100}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.07 + 0.2 }}
          className="h-full rounded-full"
          style={{
            background: isDelivered
              ? "linear-gradient(90deg, #10b981, #34d399)"
              : "linear-gradient(90deg, #3b82f6, #60a5fa)",
          }}
        />
      </div>

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Commande</p>
            <p className="text-lg font-black text-slate-900 leading-none">#{order.id}</p>
          </div>
          {isDelivered ? (
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Livrée
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700">
              {STEPS[stepIdx].label}
            </span>
          )}
        </div>

        {/* Step tracker */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const isDone = i <= stepIdx;
            const isCurrent = i === stepIdx;
            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
                      isDone && !isCurrent ? "bg-blue-500 text-white" : "",
                      isCurrent ? "ring-2 ring-blue-300 ring-offset-1 bg-blue-500 text-white" : "",
                      !isDone ? "bg-slate-100 text-slate-400" : "",
                      isDelivered && i === 3 ? "bg-emerald-500 text-white ring-2 ring-emerald-200 ring-offset-1" : "",
                    )}
                  >
                    {i < stepIdx || isDelivered ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <p className={cn(
                    "text-[9px] font-semibold text-center leading-tight whitespace-nowrap",
                    isDone ? (isDelivered && i === 3 ? "text-emerald-600" : "text-blue-600") : "text-slate-400"
                  )}>
                    {step.label}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-1 mb-4" style={{
                    background: i < stepIdx ? "#3b82f6" : "#e2e8f0"
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Customer + address */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs shrink-0">
              {order.customer.username[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-none">{order.customer.username}</p>
              {order.customer.phone && (
                <p className="text-xs text-slate-400 mt-0.5">{order.customer.phone}</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">{order.shipping_address}</p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Package className="h-3 w-3" /> Articles ({order.items.length})
          </p>
          <div className="space-y-1.5">
            {order.items.map((item) => {
              const imgUrl = item.product.image
                ? item.product.image.startsWith("http")
                  ? item.product.image
                  : `http://localhost:8000${item.product.image}`
                : null;
              return (
                <div key={item.id} className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {imgUrl
                      ? <Image src={imgUrl} alt={item.product.name} width={32} height={32} className="object-cover w-full h-full" />
                      : <Package className="h-3.5 w-3.5 text-slate-300" />}
                  </div>
                  <p className="text-xs text-slate-700 font-medium flex-1 truncate">
                    {item.product?.name ?? to("deletedProduct")}
                  </p>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-700">{formatPrice(item.subtotal, currency)}</p>
                    <p className="text-[10px] text-slate-400">×{item.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-2">
            <p className="text-xs text-slate-500 font-medium">Total</p>
            <p className="text-sm font-black text-slate-900">{formatPrice(order.total_price, currency)}</p>
          </div>
        </div>

        {/* Notes */}
        {order.assignment?.notes && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
            <MessageSquare className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">{t("note")} </span>
              {order.assignment.notes}
            </p>
          </div>
        )}

        {/* CTA */}
        {!isDelivered && CTA_KEYS[order.status] && (
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full gap-2 h-10 font-semibold rounded-xl"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
              onClick={() => advance(order.id)}
              disabled={isPending}
            >
              {isPending ? t("updating") : t(CTA_KEYS[order.status] as any)}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {isDelivered && (
          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-semibold text-emerald-700">{t("completedSuccess")}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
