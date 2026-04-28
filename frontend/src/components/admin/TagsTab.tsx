"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/hooks/useCatalog";
import type { Tag } from "@/types";

function TagForm({ initial, onSubmit, isPending }: { initial?: Tag; onSubmit: (d: { name: string; slug: string }) => void; isPending: boolean }) {
  const t = useTranslations("adminTabs.tags");
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const handleNameChange = (v: string) => { setName(v); if (!initial) setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); };
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2"><Label>{t("labelName")}</Label><Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder={t("namePlaceholder")} /></div>
      <div className="space-y-2"><Label>{t("labelSlug")}</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={t("slugPlaceholder")} /></div>
      <Button variant="luxury" className="w-full" onClick={() => onSubmit({ name, slug })} disabled={!name || !slug || isPending}>
        {isPending ? t("saving") : initial ? t("saveChanges") : t("createTag")}
      </Button>
    </div>
  );
}

function EditDialog({ tag }: { tag: Tag }) {
  const t = useTranslations("adminTabs.tags");
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateTag();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{t("editTag")}</DialogTitle></DialogHeader>
        <TagForm initial={tag} onSubmit={(data) => mutate({ id: tag.id, data }, { onSuccess: () => setOpen(false) })} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}

export default function TagsTab() {
  const t = useTranslations("adminTabs.tags");
  const [createOpen, setCreateOpen] = useState(false);
  const { data: tags, isLoading } = useAdminTags();
  const { mutate: create, isPending: creating } = useCreateTag();
  const { mutate: remove } = useDeleteTag();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">{tags?.map((tg) => <Badge key={tg.id} variant="emerald"><TagIcon className="h-3 w-3 mr-1" />{tg.name}</Badge>)}</div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button variant="luxury" size="sm" className="gap-1.5 shrink-0"><Plus className="h-4 w-4" /> {t("newTag")}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t("newTag")}</DialogTitle></DialogHeader>
            <TagForm onSubmit={(data) => create(data, { onSuccess: () => setCreateOpen(false) })} isPending={creating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}</div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>{[t("colName"), t("colSlug"), ""].map((h) => <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>)}</tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {tags?.map((tag, i) => (
                  <motion.tr key={tag.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><Badge variant="emerald">{tag.name}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{tag.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <EditDialog tag={tag} />
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { if (confirm(t("deleteConfirm", { name: tag.name }))) remove(tag.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {tags?.length === 0 && <p className="text-center py-10 text-muted-foreground">{t("noTags")}</p>}
        </div>
      )}
    </div>
  );
}
