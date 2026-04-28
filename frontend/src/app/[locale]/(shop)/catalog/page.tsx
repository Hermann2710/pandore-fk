"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/shop/ProductCard";
import { catalogApi } from "@/lib/api";

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch]   = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [ordering, setOrdering] = useState(searchParams.get("ordering") ?? "-created_at");

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setCategory(searchParams.get("category") ?? "all");
    setOrdering(searchParams.get("ordering") ?? "-created_at");
  }, [searchParams]);

  const params: Record<string, string> = { ordering };
  if (search) params.search = search;
  if (category && category !== "all") params.category = category;

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", params],
    queryFn: () => catalogApi.products(params).then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.categories().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const clearFilters = () => {
    setSearch(""); setCategory("all"); setOrdering("-created_at");
    router.push("/catalog");
  };

  const hasFilters = search || (category && category !== "all");
  const activeCategoryName = categories?.find((c) => c.slug === category)?.name;
  const count = products?.length ?? 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{tc("home")}</span><span>/</span>
          <span className="text-foreground font-medium">{activeCategoryName ?? t("allProducts")}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          {activeCategoryName
            ? <><FolderOpen className="h-6 w-6 text-primary" />{activeCategoryName}</>
            : t("ourCollection", { collection: t("collection") })
          }
        </h1>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-52">
            <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <SelectValue placeholder={t("filterByCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterByCategory")}</SelectItem>
            {categories?.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={ordering} onValueChange={setOrdering}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created_at">{t("newest")}</SelectItem>
            <SelectItem value="created_at">{t("oldest")}</SelectItem>
            <SelectItem value="price">{t("priceAsc")}</SelectItem>
            <SelectItem value="-price">{t("priceDesc")}</SelectItem>
          </SelectContent>
        </Select>

        <AnimatePresence>
          {hasFilters && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <Button variant="outline" size="icon" onClick={clearFilters} title={t("clearFilters")}><X className="h-4 w-4" /></Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!isLoading && products && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 flex-wrap">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{count}</span>{" "}
            {count !== 1 ? t("productsFoundPlural", { count }) : t("productsFound", { count })}
          </p>
          {activeCategoryName && <Badge variant="emerald">{activeCategoryName}</Badge>}
          {search && <Badge variant="secondary">"{search}"</Badge>}
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products?.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-medium">{t("noResults")}</p>
          <p className="text-muted-foreground text-sm mt-1">{t("noResultsHint")}</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>{t("clearFilters")}</Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products?.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
      )}
    </div>
  );
}
