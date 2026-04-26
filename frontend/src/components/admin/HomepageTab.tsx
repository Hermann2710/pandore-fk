"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminHomepageSections, useAdminProducts, useAdminCategories,
  useCreateHomepageSection, useUpdateHomepageSection, useDeleteHomepageSection,
} from "@/hooks/useCatalog";
import type { HomepageSection, SectionType } from "@/types";

const TYPE_LABELS: Record<SectionType, string> = {
  hero_carousel:   "Hero Carousel",
  product_row:     "Product Row",
  category_banner: "Category Banner",
  promo_banner:    "Promo Banner",
};

const TYPE_COLORS: Record<SectionType, string> = {
  hero_carousel:   "bg-purple-100 text-purple-700",
  product_row:     "bg-blue-100 text-blue-700",
  category_banner: "bg-emerald-100 text-emerald-700",
  promo_banner:    "bg-amber-100 text-amber-700",
};

// ── Section Form ──────────────────────────────────────────────────────────────
function SectionForm({
  initial, onSubmit, isPending,
}: {
  initial?: HomepageSection;
  onSubmit: (fd: FormData) => void;
  isPending: boolean;
}) {
  const [title, setTitle]       = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [type, setType]         = useState<SectionType>(initial?.type ?? "product_row");
  const [order, setOrder]       = useState(String(initial?.order ?? 0));
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? "Shop Now");
  const [ctaUrl, setCtaUrl]     = useState(initial?.cta_url ?? "");
  const [bgColor, setBgColor]   = useState(initial?.bg_color ?? "");
  const [bgImage, setBgImage]   = useState<File | null>(null);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    initial?.products.map((p) => String(p.id)) ?? []
  );
  const [categoryId, setCategoryId] = useState(String(initial?.category?.id ?? ""));

  const { data: products = [] } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();

  const toggleProduct = (id: string) =>
    setSelectedProducts((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("subtitle", subtitle);
    fd.append("type", type);
    fd.append("order", order);
    fd.append("cta_label", ctaLabel);
    fd.append("cta_url", ctaUrl);
    fd.append("bg_color", bgColor);
    fd.append("is_active", String(isActive));
    if (categoryId) fd.append("category", categoryId);
    selectedProducts.forEach((id) => fd.append("products", id));
    if (bgImage) fd.append("bg_image", bgImage);
    onSubmit(fd);
  };

  const needsProducts = type === "hero_carousel" || type === "product_row";
  const needsCategory = type === "category_banner";

  return (
    <div className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2 col-span-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New Arrivals" />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Subtitle <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Short description…" />
        </div>
        <div className="space-y-2">
          <Label>Section Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as SectionType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TYPE_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Display Order</Label>
          <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>CTA Label</Label>
          <Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Shop Now" />
        </div>
        <div className="space-y-2">
          <Label>CTA URL</Label>
          <Input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="/catalog" />
        </div>
        <div className="space-y-2">
          <Label>Background Color <span className="text-muted-foreground font-normal">(hex)</span></Label>
          <div className="flex gap-2">
            <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} placeholder="#0f172a" className="flex-1" />
            {bgColor && <div className="h-9 w-9 rounded-md border shrink-0" style={{ backgroundColor: bgColor }} />}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Background Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => setBgImage(e.target.files?.[0] ?? null)} />
        </div>

        {/* Category picker */}
        {needsCategory && (
          <div className="space-y-2 col-span-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Select category…" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Product multi-picker */}
        {needsProducts && (
          <div className="space-y-2 col-span-2">
            <Label>Products <span className="text-muted-foreground font-normal">({selectedProducts.length} selected)</span></Label>
            <div className="max-h-48 overflow-y-auto rounded-lg border p-2 space-y-1">
              {products.map((p) => (
                <label key={p.id} className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(String(p.id))}
                    onChange={() => toggleProduct(String(p.id))}
                    className="accent-emerald-500"
                  />
                  <span className="text-sm flex-1 truncate">{p.name}</span>
                  <span className="text-xs text-muted-foreground">${p.price}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="col-span-2 flex items-center gap-3">
          <button type="button" onClick={() => setIsActive((v) => !v)} className="text-primary">
            {isActive ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5 text-muted-foreground" />}
          </button>
          <Label className="cursor-pointer" onClick={() => setIsActive((v) => !v)}>
            {isActive ? "Visible on homepage" : "Hidden from homepage"}
          </Label>
        </div>
      </div>

      <Button variant="luxury" className="w-full" onClick={handleSubmit} disabled={!title || !type || isPending}>
        {isPending ? "Saving…" : initial ? "Save Changes" : "Create Section"}
      </Button>
    </div>
  );
}

function EditDialog({ section }: { section: HomepageSection }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateHomepageSection();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Edit Section</DialogTitle></DialogHeader>
        <SectionForm
          initial={section}
          onSubmit={(data) => mutate({ id: section.id, data }, { onSuccess: () => setOpen(false) })}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function HomepageTab() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: sections, isLoading } = useAdminHomepageSections();
  const { mutate: create, isPending: creating } = useCreateHomepageSection();
  const { mutate: remove } = useDeleteHomepageSection();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {sections?.length ?? 0} section{sections?.length !== 1 ? "s" : ""} — ordered by display position
        </p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="luxury" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> New Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>New Homepage Section</DialogTitle></DialogHeader>
            <SectionForm
              onSubmit={(data) => create(data, { onSuccess: () => setCreateOpen(false) })}
              isPending={creating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>{["Order", "Title", "Type", "Products", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {sections?.map((section, i) => (
                  <motion.tr
                    key={section.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <span className="font-mono text-xs">{section.order}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{section.title}</p>
                      {section.subtitle && <p className="text-xs text-muted-foreground truncate max-w-xs">{section.subtitle}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[section.type]}`}>
                        <LayoutTemplate className="h-3 w-3" />
                        {TYPE_LABELS[section.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{section.products.length}</td>
                    <td className="px-4 py-3">
                      <Badge variant={section.is_active ? "emerald" : "secondary"}>
                        {section.is_active ? "Visible" : "Hidden"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <EditDialog section={section} />
                        <Button
                          size="icon" variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => { if (confirm(`Delete "${section.title}"?`)) remove(section.id); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {sections?.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <LayoutTemplate className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="font-medium">No sections yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first section to build the homepage</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
