"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, MapPin, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useShippingAddresses, useCreateAddress,
  useUpdateAddress, useDeleteAddress,
} from "@/hooks/useAddresses";
import type { ShippingAddress } from "@/types";

// ── Address Form ──────────────────────────────────────────────────────────────
function AddressForm({
  initial, onSubmit, isPending,
}: {
  initial?: ShippingAddress;
  onSubmit: (data: Partial<ShippingAddress>) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState({
    label:       initial?.label       ?? "Home",
    full_name:   initial?.full_name   ?? "",
    line1:       initial?.line1       ?? "",
    line2:       initial?.line2       ?? "",
    city:        initial?.city        ?? "",
    state:       initial?.state       ?? "",
    postal_code: initial?.postal_code ?? "",
    country:     initial?.country     ?? "Cameroon",
    phone:       initial?.phone       ?? "",
    is_default:  initial?.is_default  ?? false,
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input placeholder="Home, Office…" value={form.label} onChange={set("label")} />
        </div>
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input placeholder="John Doe" value={form.full_name} onChange={set("full_name")} required />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Address Line 1</Label>
          <Input placeholder="123 Rue de la Paix" value={form.line1} onChange={set("line1")} required />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Address Line 2 <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input placeholder="Apt 4B" value={form.line2} onChange={set("line2")} />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Input placeholder="Douala, Yaoundé, Bafoussam…" value={form.city} onChange={set("city")} required />
        </div>
        <div className="space-y-2">
          <Label>Region</Label>
          <Input placeholder="Littoral, Centre, Ouest…" value={form.state} onChange={set("state")} />
        </div>
        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input placeholder="BP 1234" value={form.postal_code} onChange={set("postal_code")} required />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Input placeholder="Cameroon" value={form.country} onChange={set("country")} />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Phone <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input placeholder="+237 6 00 00 00 00" value={form.phone} onChange={set("phone")} />
        </div>
        <div className="col-span-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, is_default: !f.is_default }))}
            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${form.is_default ? "bg-primary border-primary" : "border-input"}`}
          >
            {form.is_default && <Check className="h-3 w-3 text-white" />}
          </button>
          <Label className="cursor-pointer" onClick={() => setForm((f) => ({ ...f, is_default: !f.is_default }))}>
            Set as default address
          </Label>
        </div>
      </div>
      <Button
        variant="luxury" className="w-full"
        onClick={() => onSubmit(form)}
        disabled={!form.full_name || !form.line1 || !form.city || !form.postal_code || isPending}
      >
        {isPending ? "Saving…" : initial ? "Save Changes" : "Add Address"}
      </Button>
    </div>
  );
}

function EditDialog({ address }: { address: ShippingAddress }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateAddress();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Edit Address</DialogTitle></DialogHeader>
        <AddressForm
          initial={address}
          onSubmit={(data) => mutate({ id: address.id, data }, { onSuccess: () => setOpen(false) })}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function AddressesTab() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: addresses, isLoading } = useShippingAddresses();
  const { mutate: create, isPending: creating } = useCreateAddress();
  const { mutate: remove } = useDeleteAddress();
  const { mutate: update } = useUpdateAddress();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{addresses?.length ?? 0} saved address{addresses?.length !== 1 ? "es" : ""}</p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="luxury" size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Address</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Address</DialogTitle></DialogHeader>
            <AddressForm
              onSubmit={(data) => create(data, { onSuccess: () => setCreateOpen(false) })}
              isPending={creating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      ) : addresses?.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center rounded-xl border bg-muted/30">
          <MapPin className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="font-medium">No saved addresses</p>
          <p className="text-sm text-muted-foreground mt-1">Add an address to speed up checkout</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {addresses?.map((addr, i) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={addr.is_default ? "border-primary/50 bg-emerald-50/30" : ""}>
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${addr.is_default ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm">{addr.label}</p>
                          {addr.is_default && <Badge variant="emerald" className="text-[10px]"><Star className="h-2.5 w-2.5 mr-1" />Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.formatted}</p>
                        {addr.phone && <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!addr.is_default && (
                        <Button
                          size="sm" variant="ghost"
                          className="h-8 text-xs text-muted-foreground hover:text-primary"
                          onClick={() => update({ id: addr.id, data: { is_default: true } })}
                        >
                          Set default
                        </Button>
                      )}
                      <EditDialog address={addr} />
                      <Button
                        size="icon" variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => { if (confirm("Delete this address?")) remove(addr.id); }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
