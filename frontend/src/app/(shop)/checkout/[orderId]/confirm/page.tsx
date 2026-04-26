"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirmPayment } from "@/hooks/usePayments";
import { toast } from "sonner";

type Stage = "processing" | "confirmed";

export default function PaymentConfirmPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { mutate: confirm } = useConfirmPayment();
  const [stage, setStage] = useState<Stage>("processing");
  const [ref, setRef] = useState("");

  useEffect(() => {
    // Simulate a 2s processing delay then auto-confirm
    const timer = setTimeout(() => {
      confirm(Number(orderId), {
        onSuccess: (res) => {
          setRef(res.data.transaction_ref);
          setStage("confirmed");
          toast.success("Payment confirmed!", { icon: "✅" });
        },
        onError: () => {
          toast.error("Payment simulation failed.");
          router.push("/orders");
        },
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [orderId, confirm, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      {stage === "processing" ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold">Processing Payment…</h1>
          <p className="text-muted-foreground">Please wait, do not close this page.</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-emerald-100"
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </motion.div>
          <h1 className="text-2xl font-bold">Payment Confirmed!</h1>
          <p className="text-muted-foreground">
            Your order <span className="font-semibold text-foreground">#{orderId}</span> has been placed successfully.
          </p>
          {ref && (
            <div className="inline-block rounded-lg bg-muted px-4 py-2 text-sm font-mono text-muted-foreground">
              Transaction ref: <span className="text-foreground font-semibold">{ref}</span>
            </div>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" asChild>
              <a href="/catalog"><Package className="h-4 w-4 mr-1.5" /> Continue Shopping</a>
            </Button>
            <Button variant="luxury" asChild>
              <a href="/orders">My Orders <ArrowRight className="h-4 w-4 ml-1.5" /></a>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
