"use client";
import { useTranslations } from "next-intl";
import { SyntheticEvent, use, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirmPayment } from "@/hooks/usePayments";
import { toast } from "sonner";

type Stage = "processing" | "confirmed";

export default function PaymentConfirmPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const t = useTranslations("checkout");
  const router = useRouter();
  const { mutate: confirm } = useConfirmPayment();
  const [stage, setStage] = useState<Stage>("processing");
  const [ref, setRef] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      confirm(Number(orderId), {
        onSuccess: (res) => {
          setRef(res.data.transaction_ref);
          setStage("confirmed");
          toast.success(t("paymentConfirmed"), { icon: "✅" });
        },
        onError: () => {
          toast.error("Payment simulation failed.");
          router.push("/orders");
        },
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [orderId, confirm, router, t]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      {stage === "processing" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold">{t("processingPayment")}</h1>
          <p className="text-muted-foreground">{t("doNotClose")}</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-emerald-100"
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </motion.div>
          <h1 className="text-2xl font-bold">{t("paymentConfirmed")}</h1>
          <p className="text-muted-foreground">
            {t("orderPlaced", { id: orderId })}
          </p>
          {ref && (
            <div className="inline-block rounded-lg bg-muted px-4 py-2 text-sm font-mono text-muted-foreground">
              {t("transactionRef", { ref })}
            </div>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" asChild>
              <Link href="/catalog" replace>
                <Package className="h-4 w-4 mr-1.5" /> {t("continueShopping")}
              </Link>
            </Button>
            <Button variant="luxury" asChild>
              <Link href="/orders" replace>
                {t("myOrders")} <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
