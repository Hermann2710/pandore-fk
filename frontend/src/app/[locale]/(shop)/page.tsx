"use client";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import SectionRenderer from "@/components/home/SectionRenderer";
import EmptyHomepage from "@/components/home/EmptyHomepage";
import { useHomepageSections } from "@/hooks/useCatalog";

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
        <motion.div key={section.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <SectionRenderer section={section} />
        </motion.div>
      ))}
    </div>
  );
}
