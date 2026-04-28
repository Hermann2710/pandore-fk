"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Star, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCurrencies, useCreateCurrency, useUpdateCurrency, useDeleteCurrency } from "@/hooks/useCurrencies";
import type { Currency } from "@/types";

const EMPTY = { code: "", name: "", symbol: "", rate: "1", is_active: true, is_default: false };

function CurrencyForm({ initial, onSubmit, onCancel, isPending }: {
  initial?: Partial<Currency>; onSubmit: (data: Partial<Currency>) => void;
  onCancel: () => void; isPending: boolean;
}) {
  const t = useTranslations("adminTabs.currencies");
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4 rounded-xl border bg-card p-5">
      <h3 className="font-semibold">{initial?.code ? t("editCurrency") : t("newCurrency")}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>{t("labelCode")} * <span className="text-muted-foreground font-normal text-xs">{t("codeHint")}</span></Label><Input value={form.code} onChange={set("code")} placeholder={t("codePlaceholder")} required maxLength={10} /></div>
        <div className="space-y-1.5"><Label>{t("labelSymbol")} * <span className="text-muted-foreground font-normal text-xs">{t("symbolHint")}</span></Label><Input value={form.symbol} onChange={set("symbol")} placeholder={t("symbolPlaceholder")} required maxLength={10} /></div>
        <div className="space-y-1.5"><Label>{t("labelName")} *</Label><Input value={form.name} onChange={set("name")} placeholder={t("namePlaceholder")} required /></div>
        <div className="space-y-1.5"><Label>{t("labelRate")} * <span className="text-muted-foreground font-normal text-xs">{t("rateHint")}</span></Label><Input type="number" step="any" value={form.rate} onChange={set("rate")} required min="0" /></div>
      </div>
      <div className="flex items-center gap-6">
        <button type="button" onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))} className="flex items-center gap-2 text-sm">
          {form.is_active ? <ToggleRight className="h-6 w-6 text-primary" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
          {form.is_active ? t("active") : t("inactive")}
        </button>
        <button type="button" onClick={() => setForm((f) => ({ ...f, is_default: !f.is_default }))} className="flex items-center gap-2 text-sm">
          <Star className={`h-5 w-5 ${form.is_default ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
          {form.is_default ? t("defaultCurrency") : t("setAsDefault")}
        </button>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>{t("cancel")}</Button>
        <Button type="submit" variant="luxury" disabled={isPending}>{isPending ? t("saving") : t("save")}</Button>
      </div>
    </form>
  );
}

export default function CurrenciesTab() {
  const t = useTranslations("adminTabs.currencies");
  const { data: currencies = [], isLoading } = useAdminCurrencies();
  const { mutate: create, isPending: creating } = useCreateCurrency();
  const { mutate: update, isPending: updating } = useUpdateCurrency();
  const { mutate: remove } = useDeleteCurrency();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Currency | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold">{t("title")}</h2><p className="text-sm text-muted-foreground">{t("subtitle")}</p></div>
        {!showForm && !editing && (
          <Button variant="luxury" size="sm" onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1.5" /> {t("addCurrency")}</Button>
        )}
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <CurrencyForm onSubmit={(d) => create(d, { onSuccess: () => setShowForm(false) })} onCancel={() => setShowForm(false)} isPending={creating} />
          </motion.div>
        )}
      </AnimatePresence>
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {currencies.map((c) => (
            <div key={c.id}>
              <AnimatePresence>
                {editing?.id === c.id ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CurrencyForm initial={c} onSubmit={(d) => update({ id: c.id, data: d }, { onSuccess: () => setEditing(null) })} onCancel={() => setEditing(null)} isPending={updating} />
                  </motion.div>
                ) : (
                  <motion.div layout className="flex items-center gap-4 rounded-xl border bg-card p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-lg font-black text-primary">{c.symbol}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><p className="font-semibold">{c.code}</p>{c.is_default && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}</div>
                      <p className="text-xs text-muted-foreground">{c.name} — rate: {c.rate}</p>
                    </div>
                    <Badge variant={c.is_active ? "emerald" : "outline"}>{c.is_active ? t("active") : t("inactive")}</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(c.id)} disabled={c.is_default}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
