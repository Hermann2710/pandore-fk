"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { adminCatalogApi } from "@/lib/api";
import { toast } from "sonner";
import type { Tag } from "@/types";

function TagForm({
  initial,
  onSubmit,
  isPending,
}: {
  initial?: Tag;
  onSubmit: (data: { name: string; slug: string }) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");

  const handleNameChange = (v: string) => {
    setName(v);
    if (!initial) setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Bestseller" />
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. bestseller" />
      </div>
      <Button
        variant="luxury" className="w-full"
        onClick={() => onSubmit({ name, slug })}
        disabled={!name || !slug || isPending}
      >
        {isPending ? "Saving…" : initial ? "Save Changes" : "Create Tag"}
      </Button>
    </div>
  );
}

function EditDialog({ tag }: { tag: Tag }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Partial<Tag>) => adminCatalogApi.updateTag(tag.id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); toast.success("Tag updated"); setOpen(false); },
    onError: () => toast.error("Update failed"),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Tag</DialogTitle></DialogHeader>
        <TagForm initial={tag} onSubmit={mutate} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}

export default function TagsTab() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: tags, isLoading } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => adminCatalogApi.tags().then((r) => r.data),
  });

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: adminCatalogApi.createTag,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); toast.success("Tag created"); setCreateOpen(false); },
    onError: () => toast.error("Creation failed"),
  });

  const { mutate: remove } = useMutation({
    mutationFn: adminCatalogApi.deleteTag,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); toast.success("Tag deleted"); },
    onError: () => toast.error("Deletion failed — tag may be in use"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{tags?.length ?? 0} tags</p>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="luxury" size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Tag</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Tag</DialogTitle></DialogHeader>
            <TagForm onSubmit={create} isPending={creating} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}</div>
      ) : (
        <>
          {/* Visual pill grid */}
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 rounded-full border bg-card px-3 py-1.5 text-sm"
              >
                <TagIcon className="h-3 w-3 text-primary" />
                <span className="font-medium">{tag.name}</span>
                <span className="text-muted-foreground text-xs ml-1">/{tag.slug}</span>
              </motion.div>
            ))}
          </div>

          {/* Management table */}
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>{["Name", "Slug", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {tags?.map((tag, i) => (
                    <motion.tr
                      key={tag.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Badge variant="emerald">{tag.name}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{tag.slug}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <EditDialog tag={tag} />
                          <Button
                            size="icon" variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => { if (confirm(`Delete tag "${tag.name}"?`)) remove(tag.id); }}
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
            {tags?.length === 0 && <p className="text-center py-10 text-muted-foreground">No tags yet</p>}
          </div>
        </>
      )}
    </div>
  );
}
