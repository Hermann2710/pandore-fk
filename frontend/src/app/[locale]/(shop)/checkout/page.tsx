"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import { useCheckout } from "@/hooks/useOrders";
import { useShippingAddresses } from "@/hooks/useAddresses";
import { usePaymentMethods } from "@/hooks/usePayments";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import CheckoutAddressStep from "@/components/checkout/CheckoutAddressStep";
import CheckoutPaymentStep from "@/components/checkout/CheckoutPaymentStep";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { user } = useAuth();
  const { items } = useCartStore();
  const { mutate: checkout, isPending } = useCheckout();
  const { data: addresses = [] } = useShippingAddresses();
  const { data: methods = [], isLoading: loadingMethods } = usePaymentMethods();

  const [step, setStep]                       = useState<1 | 2>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [manualAddress, setManualAddress]     = useState("");
  const [selectedMethodId, setSelectedMethodId]   = useState<number | null>(null);

  // Pre-select default address when addresses load
  useEffect(() => {
    const def = addresses.find((a) => a.is_default);
    if (def) setSelectedAddressId(def.id);
  }, [addresses]);

  // Guard: redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) router.push("/login");
    if (items.length === 0) router.push("/cart");
  }, [user, items, router]);

  const shippingAddress = selectedAddressId
    ? (addresses.find((a) => a.id === selectedAddressId)?.formatted ?? "")
    : manualAddress.trim();

  const handlePlaceOrder = () => {
    if (!selectedMethodId) { toast.error(t("paymentRequired")); return; }
    checkout({
      shipping_address: shippingAddress,
      payment_method_id: selectedMethodId,
      items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
        {t("title")}
      </motion.h1>

      <CheckoutSteps current={step} />

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left — active step */}
        <div className="lg:col-span-3">
          {step === 1 && (
            <CheckoutAddressStep
              addresses={addresses}
              selected={selectedAddressId}
              onSelect={setSelectedAddressId}
              manual={manualAddress}
              onManual={setManualAddress}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <CheckoutPaymentStep
              methods={methods}
              isLoading={loadingMethods}
              selected={selectedMethodId}
              onSelect={setSelectedMethodId}
              onBack={() => setStep(1)}
              onConfirm={handlePlaceOrder}
              isPending={isPending}
            />
          )}
        </div>

        {/* Right — order summary */}
        <div className="lg:col-span-2">
          <CheckoutOrderSummary shippingAddress={shippingAddress} />
        </div>
      </div>
    </div>
  );
}
