"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Send,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  useAdminNewsletters,
  useAdminSubscribers,
  useCreateNewsletter,
  useUpdateNewsletter,
  useDeleteNewsletter,
  useSendNewsletter,
} from "@/hooks/useNewsletter";
import type { Newsletter } from "@/types";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// Formulaire partagé pour création et édition
function NewsletterForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: {
  initial?: Newsletter;
  onSubmit: (data: { subject: string; content: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const t = useTranslations("adminTabs.newsletter");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [content, setContent] = useState(initial?.content ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    onSubmit({ subject, content });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border bg-card p-5"
    >
      <h3 className="font-semibold">
        {initial ? t("editNewsletter") : t("newNewsletterTitle")}
      </h3>
      <div className="space-y-1.5">
        <Label>{t("labelSubject")} *</Label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t("subjectPlaceholder")}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>{t("labelContent")} *</Label>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(v) => setContent(v ?? "")}
            height={320}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button
          type="submit"
          variant="luxury"
          disabled={isPending || !subject || !content}
        >
          {isPending ? t("saving") : t("saveDraft")}
        </Button>
      </div>
    </form>
  );
}

// Dialog de confirmation d'envoi
function SendConfirmDialog({
  newsletter,
  activeCount,
  onConfirm,
  onClose,
  isPending,
}: {
  newsletter: Newsletter;
  activeCount: number;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const t = useTranslations("adminTabs.newsletter");
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" /> {t("confirmSendTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-lg bg-muted/50 p-4 space-y-1">
            <p className="text-sm font-medium">{newsletter.subject}</p>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              {t("confirmSendWarning", { count: activeCount })}
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button variant="luxury" onClick={onConfirm} disabled={isPending}>
            {isPending ? t("sending") : t("sendCount", { count: activeCount })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function NewsletterAdminTab() {
  const t = useTranslations("adminTabs.newsletter");
  const { data: newsletters = [], isLoading } = useAdminNewsletters();
  const { data: subscribers = [] } = useAdminSubscribers();
  const { mutate: create, isPending: creating } = useCreateNewsletter();
  const { mutate: update, isPending: updating } = useUpdateNewsletter();
  const { mutate: remove } = useDeleteNewsletter();
  const { mutate: send, isPending: sending } = useSendNewsletter();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Newsletter | null>(null);
  const [sendTarget, setSendTarget] = useState<Newsletter | null>(null);

  const activeCount = subscribers.filter((s) => s.is_active).length;

  const stats = [
    {
      labelKey: "totalSubscribers",
      value: subscribers.length,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      labelKey: "activeSubscribers",
      value: activeCount,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      labelKey: "newslettersSent",
      value: newsletters.filter((n) => n.status === "sent").length,
      icon: Send,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ] as const;

  return (
    <div className="space-y-8">
      {sendTarget && (
        <SendConfirmDialog
          newsletter={sendTarget}
          activeCount={activeCount}
          onConfirm={() =>
            send(sendTarget.id, { onSuccess: () => setSendTarget(null) })
          }
          onClose={() => setSendTarget(null)}
          isPending={sending}
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.labelKey}
            className="rounded-xl border bg-card p-4 flex items-center gap-3"
          >
            <div className={`rounded-lg p-2.5 ${s.bg} ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{t(s.labelKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> {t("title")}
          </h2>
          {!showForm && !editing && (
            <Button
              variant="luxury"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" /> {t("newNewsletter")}
            </Button>
          )}
        </div>

        {showForm && (
          <NewsletterForm
            onSubmit={(data) =>
              create(data, { onSuccess: () => setShowForm(false) })
            }
            onCancel={() => setShowForm(false)}
            isPending={creating}
          />
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : newsletters.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            {t("noNewsletters")}
          </p>
        ) : (
          <div className="space-y-3">
            {newsletters.map((nl) =>
              editing?.id === nl.id ? (
                <NewsletterForm
                  key={nl.id}
                  initial={nl}
                  onSubmit={(data) =>
                    update(
                      { id: nl.id, data },
                      { onSuccess: () => setEditing(null) },
                    )
                  }
                  onCancel={() => setEditing(null)}
                  isPending={updating}
                />
              ) : (
                <motion.div
                  key={nl.id}
                  layout
                  className="flex items-center gap-4 rounded-xl border bg-card p-4"
                >
                  <div
                    className={`rounded-lg p-2 ${nl.status === "sent" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"}`}
                  >
                    {nl.status === "sent" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{nl.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {nl.status === "sent"
                        ? t("sentOn", {
                            date: new Date(nl.sent_at!).toLocaleDateString(),
                          })
                        : t("draftCreated", {
                            date: new Date(nl.created_at).toLocaleDateString(),
                          })}
                    </p>
                  </div>
                  <Badge variant={nl.status === "sent" ? "emerald" : "outline"}>
                    {nl.status === "sent" ? t("statusSent") : t("statusDraft")}
                  </Badge>
                  {nl.status === "draft" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(nl)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="luxury"
                        disabled={activeCount === 0}
                        onClick={() => setSendTarget(nl)}
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        {t("sendCount", { count: activeCount })}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => remove(nl.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
