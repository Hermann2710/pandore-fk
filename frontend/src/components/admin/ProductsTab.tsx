"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Package, Search, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProducts, useAdminCategories, useAdminTags, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useCatalog";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import type { Product, Category, Tag } from "@/types";

function ProductForm({ initial, categories, tags, onSubmit, isPending }: {
  initial?: Product; categories: Category[]; tags: Tag[];
  onSubmit: (fd: FormData) => void; isPending: boolean;
}) {
  const t = useTranslations("adminTabs.products");
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [categoryId, setCategoryId] = useState(String(initial?.category?.id ?? ""));
  const [selectedTags, setSelectedTags] = useState<string[]>(initial?.tags.map((t) => String(t.id)) ?? []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const handleNameChange = (v: string) => { setName(v); if (!initial) setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); };
  const toggleTag = (id: string) => setSelectedTags((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append("name", name); fd.append("slug", slug); fd.append("description", description);
    fd.append("price", price); fd.append("stock", stock); fd.append("is_active", String(isActive));
    if (categoryId) fd.append("category", categoryId);
    selectedTags.forEach((id) => fd.append("tags", id));
    if (imageFile) fd.append("image", imageFile);
    onSubmit(fd);
  };

  return (
    <div className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2 col-span-2"><Label>{t("labelName")}</Label><Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder={t("productNamePlaceholder")} /></div>
        <div className="space-y-2"><Label>{t("labelSlug")}</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
        <div className="space-y-2">
          <Label>{t("labelCategory")}</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger><SelectValue placeholder={t("selectCategory")} /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>{t("labelPrice")}</Label><Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        <div className="space-y-2"><Label>{t("labelStock")}</Label><Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} /></div>
        <div className="space-y-2 col-span-2">
          <Label>{t("labelDescription")}</Label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder={t("descriptionPlaceholder")} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>{t("labelTags")}</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button key={tag.id} type="button" onClick={() => toggleTag(String(tag.id))} className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${selectedTags.includes(String(tag.id)) ? "bg-primary text-white border-primary" : "bg-background text-muted-foreground hover:border-primary"}`}>
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2 col-span-2">
          <Label>{t("labelImage")}</Label>
          <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          {initial?.image && !imageFile && <div className="relative h-16 w-16 rounded-lg overflow-hidden border"><Image src={initial.image} alt={initial.name} fill className="object-cover" /></div>}
        </div>
        <div className="col-span-2 flex items-center gap-3">
          <button type="button" onClick={() => setIsActive((v) => !v)} className="text-primary">
            {isActive ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
          </button>
          <Label className="cursor-pointer" onClick={() => setIsActive((v) => !v)}>
            {isActive ? t("labelActive") : t("labelInactive")}
          </Label>
        </div>
      </div>
      <Button variant="luxury" className="w-full" onClick={handleSubmit} disabled={!name || !slug || !price || isPending}>
        {isPending ? t("saving") : initial ? t("saveChanges") : t("createProduct")}
      </Button>
    </div>
  );
}

function EditDialog({ product, categories, tags }: { product: Product; categories: Category[]; tags: Tag[] }) {
  const t = useTranslations("adminTabs.products");
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateProduct();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{t("editProduct")}</DialogTitle></DialogHeader>
        <ProductForm initial={product} categories={categories} tags={tags} onSubmit={(data) => mutate({ id: product.id, data }, { onSuccess: () => setOpen(false) })} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}

export default function ProductsTab() {
  const t = useTranslations("adminTabs.products");
  const { currency } = useCurrencyStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useAdminProducts(search);
  const { data: categories = [] } = useAdminCategories();
  const { data: tags = [] } = useAdminTags();
  const { mutate: create, isPending: creating } = useCreateProduct();
  const { mutate: remove } = useDeleteProduct();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder={t("searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <p className="text-sm text-muted-foreground whitespace-nowrap">{t("productsCount", { count: products?.length ?? 0 })}</p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button variant="luxury" size="sm" className="gap-1.5 whitespace-nowrap"><Plus className="h-4 w-4" /> {t("newProduct")}</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{t("newProduct")}</DialogTitle></DialogHeader>
            <ProductForm categories={categories} tags={tags} onSubmit={(data) => create(data, { onSuccess: () => setCreateOpen(false) })} isPending={creating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>{[t("colProduct"), t("colCategory"), t("colPrice"), t("colStock"), t("colStatus"), t("colTags"), ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {products?.map((product, i) => (
                  <motion.tr key={product.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          {product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" /> : <Package className="h-5 w-5 text-muted-foreground m-auto mt-2.5" />}
                        </div>
                        <div><p className="font-medium leading-tight">{product.name}</p><p className="text-xs text-muted-foreground font-mono">{product.slug}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatPrice(product.price, currency)}</td>
                    <td className="px-4 py-3"><span className={product.stock === 0 ? "text-destructive font-medium" : ""}>{product.stock}</span></td>
                    <td className="px-4 py-3"><Badge variant={product.is_active ? "emerald" : "secondary"}>{product.is_active ? t("active") : t("inactive")}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tg) => <Badge key={tg.id} variant="outline" className="text-[10px]">{tg.name}</Badge>)}
                        {product.tags.length > 2 && <span className="text-xs text-muted-foreground">+{product.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <EditDialog product={product} categories={categories} tags={tags} />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { if (confirm(t("deleteConfirm", { name: product.name }))) remove(product.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {products?.length === 0 && <p className="text-center py-10 text-muted-foreground">{t("noProducts")}</p>}
        </div>
      )}
    </div>
  );
}
