import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import type { HomepageSection } from "@/types";
import { mediaUrl } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  section: HomepageSection;
}

export default function HeroCarousel({ section }: Props) {
  const t = useTranslations("home");
  const [current, setCurrent] = useState(0);
  const products = section.products;
  const addItem = useCartStore((s) => s.addItem);
  const { currency } = useCurrencyStore();

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + products.length) % products.length),
    [products.length],
  );
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % products.length),
    [products.length],
  );

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (products.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, products.length]);

  if (!products.length) return null;

  const product = products[current];

  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-slate-900" style={{ minHeight: 320 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col md:grid md:grid-cols-2"
        >
          {/* Image background on mobile, side panel on desktop */}
          {product.image && (
            <div className="absolute inset-0 md:relative md:inset-auto md:order-2">
              <Image
                src={mediaUrl(product.image)!}
                alt={product.name}
                fill
                className="object-cover opacity-40 md:opacity-80"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-slate-900/20 md:bg-gradient-to-r md:from-slate-900 md:via-slate-900/20 md:to-transparent" />
            </div>
          )}

          {/* Text side */}
          <div className="relative z-10 flex flex-col justify-center px-6 md:px-14 py-10 space-y-4 md:order-1">
            {product.category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                {product.category.name}
              </span>
            )}
            <h2 className="text-2xl md:text-5xl font-black text-white leading-tight">
              {product.name}
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-sm line-clamp-2 md:line-clamp-3">
              {product.description}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-400">
              {formatPrice(product.price, currency)}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button variant="link" size="sm" asChild className="md:text-base md:h-11">
                <Link href={`/product/${product.slug}`}>{t("viewProduct")}</Link>
              </Button>
              <Button
                variant="luxury"
                size="sm"
                className="md:text-base md:h-11 border-slate-600 text-white hover:bg-slate-800 gap-2"
                onClick={() => { addItem(product); toast.success(t("addedToCart", { name: product.name })); }}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" /> {t("addToCart")}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {products.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-emerald-400" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
