"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, ArrowRight, MapPin, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { useCheckout } from "@/hooks/useOrders";
import { useShippingAddresses } from "@/hooks/useAddresses";
import { toast } from "sonner";
import type { ShippingAddress } from "@/types";

// ── Address selector shown in the order summary ───────────────────────────────
function AddressSelector({
  addresses,
  selected,
  onSelect,
  manualAddress,
  onManualChange,
}: {
  addresses: ShippingAddress[];
  selected: number | null;
  onSelect: (id: number | null) => void;
  manualAddress: string;
  onManualChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = addresses.find((a) => a.id === selected);

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Shipping Address</Label>

      {addresses.length > 0 && (
        <div className="space-y-2">
          {/* Saved address picker */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5 text-sm hover:bg-muted transition-colors"
          >
            <span className="text-left truncate">
              {active ? (
                <span className="font-medium">{active.label} — {active.formatted}</span>
              ) : (
                <span className="text-muted-foreground">Select a saved address…</span>
              )}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-lg border bg-card shadow-md"
              >
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => { onSelect(addr.id); setOpen(false); }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted transition-colors border-b last:border-0 ${selected === addr.id ? "bg-emerald-50" : ""}`}
                  >
                    <MapPin className={`h-4 w-4 mt-0.5 shrink-0 ${selected === addr.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium">{addr.label} {addr.is_default && <Badge variant="emerald" className="text-[10px] ml-1">Default</Badge>}</p>
                      <p className="text-muted-foreground text-xs">{addr.formatted}</p>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { onSelect(null); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-primary hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" /> Enter a different address
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Manual input — shown when no saved address selected or no addresses exist */}
      {selected === null && (
        <div className="space-y-1.5">
          <Input
            placeholder="123 Luxury Ave, Paris, 75001, France"
            value={manualAddress}
            onChange={(e) => onManualChange(e.target.value)}
          />
          {addresses.length > 0 && (
            <Link href="/profile" className="text-xs text-primary hover:underline">
              Manage saved addresses →
            </Link>
          )}
          {addresses.length === 0 && (
            <Link href="/profile" className="text-xs text-primary hover:underline">
              Save addresses to your profile for faster checkout →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ── Cart page ─────────────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { mutate: checkout, isPending } = useCheckout();
  const { data: addresses = [] } = useShippingAddresses();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [manualAddress, setManualAddress] = useState("");

  // Pre-select the default address when addresses load
  useEffect(() => {
    const def = addresses.find((a) => a.is_default);
    if (def) setSelectedAddressId(def.id);
  }, [addresses]);

  const handleCheckout = () => {
    const shippingAddress = selectedAddressId
      ? addresses.find((a) => a.id === selectedAddressId)?.formatted ?? ""
      : manualAddress.trim();

    if (!shippingAddress) { toast.error("Please enter a shipping address."); return; }
    checkout({
      shipping_address: shippingAddress,
      items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
    });
  };

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/20 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Discover our luxury collection</p>
        <Button variant="luxury" asChild><Link href="/catalog">Browse Catalog</Link></Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
        Your <span className="text-primary">Cart</span>
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div key={item.product.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.product.image
                        ? <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        : <div className="h-full w-full bg-muted" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">${item.product.price} each</p>
                    </div>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 hover:bg-muted text-sm">−</button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 hover:bg-muted text-sm">+</button>
                    </div>
                    <p className="font-bold text-primary w-20 text-right">${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-bold">Order Summary</h2>

              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate">{item.product.name} ×{item.quantity}</span>
                    <span>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice().toFixed(2)}</span>
                </div>
              </div>

              <AddressSelector
                addresses={addresses}
                selected={selectedAddressId}
                onSelect={setSelectedAddressId}
                manualAddress={manualAddress}
                onManualChange={setManualAddress}
              />

              <motion.div whileTap={{ scale: 0.97 }}>
                <Button variant="luxury" size="lg" className="w-full gap-2" onClick={handleCheckout} disabled={isPending}>
                  {isPending ? "Processing…" : "Place Order"}<ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
