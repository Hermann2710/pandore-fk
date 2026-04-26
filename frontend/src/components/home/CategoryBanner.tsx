"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomepageSection } from "@/types";

interface Props { section: HomepageSection; }

export default function CategoryBanner({ section }: Props) {
  const href = section.cta_url || (section.category ? `/catalog?category=${section.category.slug}` : "/catalog");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl"
      style={{ minHeight: 220, backgroundColor: section.bg_color || "#0f172a" }}
    >
      {/* Background image */}
      {section.bg_image && (
        <Image src={section.bg_image} alt={section.title} fill className="object-cover opacity-40" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-10 py-10 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
          <FolderOpen className="h-4 w-4" />
          {section.category?.name ?? "Collection"}
        </div>
        <h2 className="text-3xl font-black text-white">{section.title}</h2>
        {section.subtitle && <p className="text-slate-300 text-sm max-w-md">{section.subtitle}</p>}
        <Button variant="luxury" size="lg" className="w-fit gap-2 mt-2" asChild>
          <Link href={href}>{section.cta_label || "Shop Now"} <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </motion.section>
  );
}
