"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Truck, ShieldCheck } from "lucide-react";

const features = [
  { icon: Package, title: "Luxury Catalog", desc: "Curated products with advanced filtering by category, tags & attributes." },
  { icon: Truck, title: "Real-Time Tracking", desc: "Follow your order from assignment to doorstep, live." },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "HTTP-only JWT cookies. Your session is never exposed to JavaScript." },
];

export default function HomePage() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="flex flex-col items-center text-center py-20 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 font-medium"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Premium E-Commerce Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-bold tracking-tight"
        >
          PAN<span className="text-primary">DORE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-xl"
        >
          A luxury shopping experience with seamless delivery management. Built for those who expect the best.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4"
        >
          <Button variant="luxury" size="xl" asChild>
            <Link href="/catalog">
              Explore Collection <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            className="rounded-2xl border bg-card p-6 space-y-3 hover:shadow-lg transition-shadow group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent group-hover:bg-primary transition-colors">
              <f.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
