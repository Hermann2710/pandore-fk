"use client";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

interface Props { current: 1 | 2; }

export default function CheckoutSteps({ current }: Props) {
  const t = useTranslations("checkout");
  const steps = [t("stepShipping"), t("stepPayment")];

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done   = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors
              ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
              {done ? <CheckCircle2 className="h-4 w-4" /> : n}
            </div>
            <span className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border mx-1" />}
          </div>
        );
      })}
    </div>
  );
}
