"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function EmptyHomepage() {
  const t  = useTranslations("nav");
  const ta = useTranslations("auth");
  const tc = useTranslations("catalog");
  const { data: config } = useSiteConfig();
  const siteName = config?.site_name ?? "PANDORE";

  return (
    <div className="space-y-24">
      <section className="flex flex-col items-center text-center py-24 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 font-medium"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          {config?.tagline ?? tc("premiumPlatform")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight"
        >
          {siteName.length > 3
            ? <>{siteName.slice(0, -3)}<span className="text-primary">{siteName.slice(-3)}</span></>
            : <span className="text-primary">{siteName}</span>}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-xl"
        >
          {config?.description ?? "A luxury shopping experience with seamless delivery management."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4"
        >
          <Button variant="luxury" size="xl" asChild>
            <Link href="/catalog">{t("newArrivals")} <ArrowRight className="h-5 w-5" /></Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href="/login">{ta("login")}</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
