"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCatalog";
import type { Category } from "@/types";

function CategoryForm({ initial, onSubmit, isPending }: {
  initial?: Category;
  onSubmit: (data: { name: string; slug: string; description: string }) => void;
  isPending: boolean;
}) {
  const t = useTranslations("adminTabs.categories");
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  const handleNameChange = (v: string) => {
    setName(v);
    if (!initial) setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2"><Label>{t("labelName")}</Label><Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder={t("namePlaceholder")} /></div>
      <div className="space-y-2"><Label>{t("labelSlug")}</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={t("slugPlaceholder")} /></div>
      <div className="space-y-2"><Label>{t("labelDescription")}</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("descPlaceholder")} /></div>
      <Button variant="luxury" className="w-full" onClick={() => onSubmit({ name, slug, description })} disabled={!name || !slug || isPending}>
        {isPending ? t("saving") : initial ? t("saveChanges") : t("createCategory")}
      </Button>
    </div>
  );
}

function EditDialog({ category }: { category: Category }) {
  const t = useTranslations("adminTabs.categories");
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateCategory();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{t("editCategory")}</DialogTitle></DialogHeader>
        <CategoryForm initial={category} onSubmit={(data) => mutate({ id: category.id, data }, { onSuccess: () => setOpen(false) })} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}

export default function CategoriesTab() {
  const t = useTranslations("adminTabs.categories");
  const [createOpen, setCreateOpen] = useState(false);
  const { data: categories, isLoading } = useAdminCategories();
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: remove } = useDeleteCategory();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t("categoriesCount", { count: categories?.length ?? 0 })}</p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button variant="luxury" size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> {t("newCategory")}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("newCategory")}</DialogTitle></DialogHeader>
            <CategoryForm onSubmit={(data) => create(data, { onSuccess: () => setCreateOpen(false) })} isPending={creating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>{[t("colName"), t("colSlug"), t("colDescription"), ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {categories?.map((cat, i) => (
                  <motion.tr key={cat.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium flex items-center gap-2"><FolderOpen className="h-4 w-4 text-primary" />{cat.name}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-xs">{cat.description || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <EditDialog category={cat} />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { if (confirm(t("deleteConfirm", { name: cat.name }))) remove(cat.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {categories?.length === 0 && <p className="text-center py-10 text-muted-foreground">{t("noCategories")}</p>}
        </div>
      )}
    </div>
  );
}
