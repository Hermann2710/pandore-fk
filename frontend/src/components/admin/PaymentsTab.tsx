"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Pencil, Trash2, CreditCard, ToggleLeft, ToggleRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPaymentMethods, useAdminPayments, useCreatePaymentMethod, useUpdatePaymentMethod, useDeletePaymentMethod } from "@/hooks/usePayments";
import { mediaUrl } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

function MethodForm({ initial, onSubmit, onCancel, isPending }: {
  initial?: PaymentMethod; onSubmit: (fd: FormData) => void;
  onCancel: () => void; isPending: boolean;
}) {
  const t = useTranslations("adminTabs.payments");
  const [name, setName] = useState(initial?.name ?? "");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [order, setOrder] = useState(String(initial?.order ?? 0));
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [logo, setLogo] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name); fd.append("instructions", instructions);
    fd.append("order", order); fd.append("is_active", String(isActive));
    if (logo) fd.append("logo", logo);
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-5">
      <h3 className="font-semibold">{initial ? t("editMethod") : t("newMethod")}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>{t("labelName")} *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="space-y-1.5"><Label>{t("labelOrder")}</Label><Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} min={0} /></div>
      </div>
      <div className="space-y-1.5">
        <Label>{t("labelInstructions")}</Label>
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder={t("instructionsPlaceholder")}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none" />
      </div>
      <div className="flex items-center gap-6">
        <div className="space-y-1.5 flex-1"><Label>{t("labelLogo")}</Label><Input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} /></div>
        <div className="flex items-center gap-2 pt-5">
          <button type="button" onClick={() => setIsActive((v) => !v)} className="text-primary">
            {isActive ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-muted-foreground" />}
          </button>
          <span className="text-sm">{isActive ? t("active") : t("inactive")}</span>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>{t("cancel")}</Button>
        <Button type="submit" variant="luxury" disabled={isPending}>{isPending ? t("saving") : t("save")}</Button>
      </div>
    </form>
  );
}

export default function PaymentsTab() {
  const t = useTranslations("adminTabs.payments");
  const { data: methods = [], isLoading } = useAdminPaymentMethods();
  const { data: payments = [] } = useAdminPayments();
  const { mutate: create, isPending: creating } = useCreatePaymentMethod();
  const { mutate: update, isPending: updating } = useUpdatePaymentMethod();
  const { mutate: remove } = useDeletePaymentMethod();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);

  const statusIcon = { confirmed: CheckCircle2, pending: Clock, failed: XCircle };
  const statusColor = { confirmed: "text-emerald-500", pending: "text-amber-500", failed: "text-red-500" };

  return (
    <div className="space-y-8">
      {/* Payment Methods */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> {t("title")}</h2>
          {!showForm && !editing && (
            <Button variant="luxury" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> {t("addMethod")}
            </Button>
          )}
        </div>
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <MethodForm onSubmit={(fd) => create(fd, { onSuccess: () => setShowForm(false) })} onCancel={() => setShowForm(false)} isPending={creating} />
            </motion.div>
          )}
        </AnimatePresence>
        {isLoading ? (
          <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : methods.length === 0 ? (
          <p className="text-muted-foreground text-sm py-6 text-center">{t("noMethods")}</p>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => (
              <div key={method.id}>
                <AnimatePresence>
                  {editing?.id === method.id ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <MethodForm initial={method} onSubmit={(fd) => update({ id: method.id, data: fd }, { onSuccess: () => setEditing(null) })} onCancel={() => setEditing(null)} isPending={updating} />
                    </motion.div>
                  ) : (
                    <motion.div layout className="flex items-center gap-4 rounded-xl border bg-card p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
                        {method.logo ? <Image src={mediaUrl(method.logo)!} alt={method.name} width={48} height={48} className="object-contain" /> : <CreditCard className="h-6 w-6 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{method.name}</p>
                        {method.instructions && <p className="text-xs text-muted-foreground truncate">{method.instructions}</p>}
                      </div>
                      <Badge variant={method.is_active ? "emerald" : "outline"}>{method.is_active ? t("active") : t("inactive")}</Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(method)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(method.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">{t("recentPayments")}</h2>
        {payments.length === 0 ? (
          <p className="text-muted-foreground text-sm py-6 text-center">{t("noPayments")}</p>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>{[t("colOrder"), t("colMethod"), t("colStatus"), t("colRef"), t("colDate")].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const Icon = statusIcon[p.status];
                  return (
                    <tr key={p.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">#{p.id}</td>
                      <td className="px-4 py-3">{p.method?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 ${statusColor[p.status]}`}>
                          <Icon className="h-4 w-4" />{t(`status${p.status.charAt(0).toUpperCase() + p.status.slice(1)}` as any)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.transaction_ref || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
