"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { MapPin, ChevronDown, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ShippingAddress } from "@/types";

interface Props {
  addresses: ShippingAddress[];
  selected: number | null;
  onSelect: (id: number | null) => void;
  manual: string;
  onManual: (v: string) => void;
  onNext: () => void;
}

export default function CheckoutAddressStep({ addresses, selected, onSelect, manual, onManual, onNext }: Props) {
  const t = useTranslations("checkout");
  const [open, setOpen] = useState(false);
  const active = addresses.find((a) => a.id === selected);

  const handleNext = () => {
    const addr = selected ? active?.formatted : manual.trim();
    if (!addr) { toast.error(t("addressRequired")); return; }
    onNext();
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> {t("shippingAddress")}
        </h2>

        {addresses.length > 0 && (
          <div className="space-y-2">
            <button type="button" onClick={() => setOpen((v) => !v)}
              className="w-full flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3 text-sm hover:bg-muted transition-colors">
              <span className="text-left truncate">
                {active
                  ? <span className="font-medium">{active.label} — {active.formatted}</span>
                  : <span className="text-muted-foreground">{t("selectAddress")}</span>}
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden rounded-xl border bg-card shadow-md">
                  {addresses.map((addr) => (
                    <button key={addr.id} type="button"
                      onClick={() => { onSelect(addr.id); setOpen(false); }}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors border-b last:border-0 ${selected === addr.id ? "bg-emerald-50" : ""}`}>
                      <MapPin className={`h-4 w-4 mt-0.5 shrink-0 ${selected === addr.id ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-medium">
                          {addr.label}
                          {addr.is_default && <Badge variant="emerald" className="text-[10px] ml-1">{t("defaultBadge")}</Badge>}
                        </p>
                        <p className="text-muted-foreground text-xs">{addr.formatted}</p>
                      </div>
                    </button>
                  ))}
                  <button type="button" onClick={() => { onSelect(null); setOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-muted transition-colors">
                    <Plus className="h-4 w-4" /> {t("enterAddress")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {selected === null && (
          <div className="space-y-1.5">
            <Input placeholder={t("addressPlaceholder")} value={manual} onChange={(e) => onManual(e.target.value)} />
            <Link href="/profile" className="text-xs text-primary hover:underline">
              {addresses.length > 0 ? t("manageAddresses") : t("saveAddresses")}
            </Link>
          </div>
        )}
      </div>

      <Button variant="luxury" size="lg" className="w-full gap-2" onClick={handleNext}>
        {t("continueToPayment")} <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
