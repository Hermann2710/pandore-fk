"use client";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shop/ProductCard";
import type { HomepageSection } from "@/types";

interface Props {
  section: HomepageSection;
}

export default function ProductRow({ section }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (!section.products.length) return null;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{section.title}</h2>
          {section.subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {section.subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Scroll arrows */}
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-card hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-full border bg-card hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {section.cta_url && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-primary"
              asChild
            >
              <Link href={section.cta_url}>
                {section.cta_label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Scrollable product strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {section.products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0 w-72"
          >
            <ProductCard product={product} index={i} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
