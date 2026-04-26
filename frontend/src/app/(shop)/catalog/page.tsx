"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { catalogApi } from "@/lib/api";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  // "all" is the sentinel for "no filter" — Radix Select forbids empty string values
  const [category, setCategory] = useState("all");
  const [ordering, setOrdering] = useState("-created_at");

  // Build query params from filter state
  const params: Record<string, string> = { ordering };
  if (search) params.search = search;
  if (category && category !== "all") params.category = category;

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["products", params],
    queryFn: () => catalogApi.products(params).then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.categories().then((r) => r.data),
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setOrdering("-created_at");
  };

  const hasFilters = search || (category && category !== "all");

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Our <span className="text-primary">Collection</span>
        </h1>
        <p className="text-muted-foreground">
          Discover our curated luxury catalog
        </p>
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ordering} onValueChange={setOrdering}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created_at">Newest first</SelectItem>
            <SelectItem value="created_at">Oldest first</SelectItem>
            <SelectItem value="price">Price: Low → High</SelectItem>
            <SelectItem value="-price">Price: High → Low</SelectItem>
          </SelectContent>
        </Select>

        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results count */}
      {!loadingProducts && products && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          {products.length} product{products.length !== 1 ? "s" : ""} found
          {category && category !== "all" && (
            <Badge variant="emerald" className="ml-2">
              {category}
            </Badge>
          )}
        </motion.p>
      )}

      {/* Product grid */}
      {loadingProducts ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Try adjusting your filters
          </p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>
            Clear filters
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products?.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
