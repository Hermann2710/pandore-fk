"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaymentMethod } from "@/types";
import { mediaUrl } from "@/lib/utils";

interface Props {
  methods: PaymentMethod[];
  isLoading: boolean;
  selected: number | null;
  onSelect: (id: number) => void;
  onBack: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function CheckoutPaymentStep({ methods, isLoading, selected, onSelect, onBack, onConfirm, isPending }: Props) {
  const t = useTranslations("checkout");
  const active = methods.find((m) => m.id === selected);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" /> {t("paymentMethod")}
      </h2>

      <div className="grid gap-3">
        {methods.map((method) => (
          <motion.button key={method.id} whileTap={{ scale: 0.98 }} onClick={() => onSelect(method.id)}
            className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all
              ${selected === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"}`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
              {method.logo
                ? <Image src={mediaUrl(method.logo)!} alt={method.name} width={48} height={48} className="object-contain" />
                : <CreditCard className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{method.name}</p>
              {method.instructions && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{method.instructions}</p>
              )}
            </div>
            <div className={`h-5 w-5 rounded-full border-2 shrink-0 transition-colors flex items-center justify-center
              ${selected === method.id ? "border-primary bg-primary" : "border-muted-foreground"}`}>
              {selected === method.id && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
          </motion.button>
        ))}
      </div>

      {active?.instructions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-semibold mb-1">{t("instructions")}</p>
          <p>{active.instructions}</p>
        </motion.div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>{t("back")}</Button>
        <Button variant="luxury" size="lg" className="flex-1 gap-2" disabled={!selected || isPending} onClick={onConfirm}>
          {isPending ? t("placingOrder") : t("placeOrder")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
