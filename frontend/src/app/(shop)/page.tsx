"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SectionRenderer from "@/components/home/SectionRenderer";
import { useHomepageSections } from "@/hooks/useCatalog";

// Shown when no sections have been configured yet
function EmptyHomepage() {
  return (
    <div className="space-y-24">
      <section className="flex flex-col items-center text-center py-24 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
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
          A luxury shopping experience with seamless delivery management.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4"
        >
          <Button variant="luxury" size="xl" asChild>
            <Link href="/catalog">Explore Collection <ArrowRight className="h-5 w-5" /></Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

export default function HomePage() {
  const { data: sections, isLoading } = useHomepageSections();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="w-full rounded-2xl" style={{ height: 420 }} />
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-52 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!sections?.length) return <EmptyHomepage />;

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SectionRenderer section={section} />
        </motion.div>
      ))}
    </div>
  );
}
