"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  ChevronDown,
  ArrowRight,
  Plus,
  CheckCircle2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart";
import { useCheckout } from "@/hooks/useOrders";
import { useShippingAddresses } from "@/hooks/useAddresses";
import { usePaymentMethods } from "@/hooks/usePayments";
import { useAuth } from "@/context/AuthContext";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { toast } from "sonner";
import type { ShippingAddress, PaymentMethod } from "@/types";

// ── Step indicator ────────────────────────────────────────────────────────────
function Steps({ current }: { current: 1 | 2 }) {
  const steps = ["Shipping", "Payment"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors
              ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : n}
            </div>
            <span
              className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className="h-px w-8 bg-border mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Address step ──────────────────────────────────────────────────────────────
function AddressStep({
  addresses,
  selected,
  onSelect,
  manual,
  onManual,
  onNext,
}: {
  addresses: ShippingAddress[];
  selected: number | null;
  onSelect: (id: number | null) => void;
  manual: string;
  onManual: (v: string) => void;
  onNext: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = addresses.find((a) => a.id === selected);

  const handleNext = () => {
    const addr = selected ? active?.formatted : manual.trim();
    if (!addr) {
      toast.error("Please enter a shipping address.");
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Shipping Address
        </h2>

        {addresses.length > 0 && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="w-full flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3 text-sm hover:bg-muted transition-colors"
            >
              <span className="text-left truncate">
                {active ? (
                  <span className="font-medium">
                    {active.label} — {active.formatted}
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Select a saved address…
                  </span>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-xl border bg-card shadow-md"
                >
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => {
                        onSelect(addr.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors border-b last:border-0 ${selected === addr.id ? "bg-emerald-50" : ""}`}
                    >
                      <MapPin
                        className={`h-4 w-4 mt-0.5 shrink-0 ${selected === addr.id ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <div>
                        <p className="font-medium">
                          {addr.label}{" "}
                          {addr.is_default && (
                            <Badge
                              variant="emerald"
                              className="text-[10px] ml-1"
                            >
                              Default
                            </Badge>
                          )}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {addr.formatted}
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(null);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Enter a different address
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {selected === null && (
          <div className="space-y-1.5">
            <Input
              placeholder="123 Luxury Ave, Yaoundé, Cameroon"
              value={manual}
              onChange={(e) => onManual(e.target.value)}
            />
            <Link
              href="/profile"
              className="text-xs text-primary hover:underline"
            >
              {addresses.length > 0
                ? "Manage saved addresses →"
                : "Save addresses to your profile →"}
            </Link>
          </div>
        )}
      </div>

      <Button
        variant="luxury"
        size="lg"
        className="w-full gap-2"
        onClick={handleNext}
      >
        Continue to Payment <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

// ── Payment step ──────────────────────────────────────────────────────────────
function PaymentStep({
  methods,
  selected,
  onSelect,
  onBack,
  onConfirm,
  isPending,
}: {
  methods: PaymentMethod[];
  selected: number | null;
  onSelect: (id: number) => void;
  onBack: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const active = methods.find((m) => m.id === selected);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-lg font-bold flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" /> Payment Method
      </h2>

      <div className="grid gap-3">
        {methods.map((method) => (
          <motion.button
            key={method.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(method.id)}
            className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all
              ${selected === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"}`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
              {method.logo ? (
                <Image
                  src={method.logo}
                  alt={method.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{method.name}</p>
              {method.instructions && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {method.instructions}
                </p>
              )}
            </div>
            <div
              className={`h-5 w-5 rounded-full border-2 shrink-0 transition-colors flex items-center justify-center
              ${selected === method.id ? "border-primary bg-primary" : "border-muted-foreground"}`}
            >
              {selected === method.id && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {active?.instructions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <p className="font-semibold mb-1">Instructions</p>
          <p>{active.instructions}</p>
        </motion.div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="luxury"
          size="lg"
          className="flex-1 gap-2"
          disabled={!selected || isPending}
          onClick={onConfirm}
        >
          {isPending ? "Placing order…" : "Place Order"}{" "}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice } = useCartStore();
  const { mutate: checkout, isPending } = useCheckout();
  const { data: addresses = [] } = useShippingAddresses();
  const { data: methods = [], isLoading: loadingMethods } = usePaymentMethods();
  const { currency } = useCurrencyStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [manualAddress, setManualAddress] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);

  useEffect(() => {
    const def = addresses.find((a) => a.is_default);
    if (def) setSelectedAddressId(def.id);
  }, [addresses]);

  useEffect(() => {
    if (!user) router.push("/login");
    if (items.length === 0) router.push("/cart");
  }, [user, items, router]);

  const shippingAddress = selectedAddressId
    ? (addresses.find((a) => a.id === selectedAddressId)?.formatted ?? "")
    : manualAddress.trim();

  const handlePlaceOrder = () => {
    if (!selectedMethodId) {
      toast.error("Please select a payment method.");
      return;
    }
    checkout({
      shipping_address: shippingAddress,
      payment_method_id: selectedMethodId,
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
      })),
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Check<span className="text-primary">out</span>
      </motion.h1>

      <Steps current={step} />

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left — steps */}
        <div className="lg:col-span-3">
          {step === 1 && (
            <AddressStep
              addresses={addresses}
              selected={selectedAddressId}
              onSelect={setSelectedAddressId}
              manual={manualAddress}
              onManual={setManualAddress}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 &&
            (loadingMethods ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : (
              <PaymentStep
                methods={methods}
                selected={selectedMethodId}
                onSelect={setSelectedMethodId}
                onBack={() => setStep(1)}
                onConfirm={handlePlaceOrder}
                isPending={isPending}
              />
            ))}
        </div>

        {/* Right — order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" /> Order Summary
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item.product.image ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ×{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    {formatPrice(parseFloat(item.product.price) * item.quantity, currency)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice(), currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalPrice(), currency)}</span>
              </div>
            </div>
            {shippingAddress && (
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Delivering to
                </p>
                {shippingAddress}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
