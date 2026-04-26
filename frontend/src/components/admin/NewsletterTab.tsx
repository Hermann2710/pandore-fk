"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Send, Users, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminNewsletters, useAdminSubscribers,
  useCreateNewsletter, useUpdateNewsletter, useDeleteNewsletter, useSendNewsletter,
} from "@/hooks/useNewsletter";
import type { Newsletter } from "@/types";

// Dynamic import to avoid SSR issues with the markdown editor
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function NewsletterForm({
  initial, onSubmit, onCancel, isPending,
}: {
  initial?: Newsletter; onSubmit: (data: { subject: string; content: string }) => void;
  onCancel: () => void; isPending: boolean;
}) {
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [content, setContent] = useState(initial?.content ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    onSubmit({ subject, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-5">
      <h3 className="font-semibold">{initial ? "Edit" : "New"} Newsletter</h3>
      <div className="space-y-1.5">
        <Label>Subject *</Label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. New arrivals this week 🎉" required />
      </div>
      <div className="space-y-1.5">
        <Label>Content *</Label>
        <div data-color-mode="light">
          <MDEditor value={content} onChange={(v) => setContent(v ?? "")} height={320} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="luxury" disabled={isPending || !subject || !content}>
          {isPending ? "Saving…" : "Save Draft"}
        </Button>
      </div>
    </form>
  );
}

export default function NewsletterAdminTab() {
  const { data: newsletters = [], isLoading } = useAdminNewsletters();
  const { data: subscribers = [] } = useAdminSubscribers();
  const { mutate: create, isPending: creating } = useCreateNewsletter();
  const { mutate: update, isPending: updating } = useUpdateNewsletter();
  const { mutate: remove } = useDeleteNewsletter();
  const { mutate: send, isPending: sending } = useSendNewsletter();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Newsletter | null>(null);

  const activeCount = subscribers.filter((s) => s.is_active).length;

  const handleCreate = (data: { subject: string; content: string }) =>
    create(data, { onSuccess: () => setShowForm(false) });

  const handleUpdate = (data: { subject: string; content: string }) => {
    if (!editing) return;
    update({ id: editing.id, data }, { onSuccess: () => setEditing(null) });
  };

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Subscribers", value: subscribers.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Subscribers", value: activeCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Newsletters Sent", value: newsletters.filter((n) => n.status === "sent").length, icon: Send, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className={`rounded-lg p-2.5 ${s.bg} ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </div>
        ))}
      </div>

      {/* Newsletters list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Newsletters</h2>
          {!showForm && !editing && (
            <Button variant="luxury" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> New Newsletter
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <NewsletterForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} isPending={creating} />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : newsletters.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No newsletters yet. Create one above.</p>
        ) : (
          <div className="space-y-3">
            {newsletters.map((nl) => (
              <div key={nl.id}>
                <AnimatePresence>
                  {editing?.id === nl.id ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <NewsletterForm initial={nl} onSubmit={handleUpdate} onCancel={() => setEditing(null)} isPending={updating} />
                    </motion.div>
                  ) : (
                    <motion.div layout className="flex items-center gap-4 rounded-xl border bg-card p-4">
                      <div className={`rounded-lg p-2 shrink-0 ${nl.status === "sent" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"}`}>
                        {nl.status === "sent" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{nl.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {nl.status === "sent"
                            ? `Sent ${new Date(nl.sent_at!).toLocaleDateString()}`
                            : `Draft — created ${new Date(nl.created_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Badge variant={nl.status === "sent" ? "emerald" : "outline"}>{nl.status}</Badge>
                      <div className="flex gap-1 shrink-0">
                        {nl.status === "draft" && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => setEditing(nl)} title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="luxury" disabled={sending || activeCount === 0}
                              onClick={() => send(nl.id)} title={`Send to ${activeCount} subscribers`}>
                              <Send className="h-3.5 w-3.5 mr-1.5" />
                              Send ({activeCount})
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                          onClick={() => remove(nl.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subscribers list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Subscribers</h2>
        {subscribers.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">No subscribers yet.</p>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  {["Email", "Status", "Subscribed"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{s.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.is_active ? "emerald" : "outline"}>{s.is_active ? "Active" : "Unsubscribed"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
