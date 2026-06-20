"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomepageSection } from "@/types";
import { mediaUrl } from "@/lib/utils";

interface Props {
  section: HomepageSection;
}

export default function PromoBanner({ section }: Props) {
  const t = useTranslations("home");
  const href = section.cta_url || "/catalog";

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl"
      style={{ minHeight: 160, backgroundColor: section.bg_color || "#059669" }}
    >
      {section.bg_image && (
        <Image
          src={mediaUrl(section.bg_image)!}
          alt={section.title}
          fill
          className="object-cover opacity-30"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />

      <div className="relative z-10 flex items-center justify-between h-full px-10 py-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> {t("limitedOffer")}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-white/80 text-sm">{section.subtitle}</p>
          )}
        </div>
        <Button
          variant="link"
          size="lg"
          className="shrink-0 border-white text-white hover:bg-white hover:text-slate-900 gap-2"
          asChild
        >
          <Link href={href}>
            {section.cta_label || t("shopNow")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
