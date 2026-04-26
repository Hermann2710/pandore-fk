"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { HomepageSection } from "@/types";
import { toast } from "sonner";

interface Props {
  section: HomepageSection;
}

export default function HeroCarousel({ section }: Props) {
  const [current, setCurrent] = useState(0);
  const products = section.products;
  const addItem = useCartStore((s) => s.addItem);

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
    <section
      className="relative w-full overflow-hidden rounded-2xl bg-slate-900"
      style={{ minHeight: 420 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="absolute inset-0 grid md:grid-cols-2"
        >
          {/* Text side */}
          <div className="flex flex-col justify-center px-8 md:px-14 py-12 space-y-5 z-10">
            {product.category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                {product.category.name}
              </span>
            )}
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {product.name}
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm line-clamp-3">
              {product.description}
            </p>
            <p className="text-3xl font-bold text-emerald-400">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="link" size="lg" asChild>
                <Link href={`/product/${product.slug}`}>View Product</Link>
              </Button>
              <Button
                variant="luxury"
                size="lg"
                className="border-slate-600 text-white hover:bg-slate-800 gap-2"
                onClick={() => {
                  addItem(product);
                  toast.success(`${product.name} added to cart`);
                }}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>

          {/* Image side */}
          <div className="relative hidden md:block">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover opacity-80"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-l from-emerald-900/30 to-transparent" />
            )}
            {/* Gradient overlay blending into text side */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/20 to-transparent" />
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
