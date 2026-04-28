"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useChangePassword } from "@/hooks/useProfile";
import { toast } from "sonner";

export default function ChangePasswordTab() {
  const t = useTranslations("profile.password");
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const { mutate: change, isPending } = useChangePassword();

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.confirm) { toast.error(t("mismatch")); return; }
    if (form.new_password.length < 8) { toast.error(t("tooShort")); return; }
    change(
      { current_password: form.current_password, new_password: form.new_password },
      { onSuccess: () => setForm({ current_password: "", new_password: "", confirm: "" }) }
    );
  };

  const FIELDS = [
    { key: "current_password" as const, labelKey: "current", showKey: "current" as const },
    { key: "new_password"     as const, labelKey: "new",     showKey: "next"    as const },
    { key: "confirm"          as const, labelKey: "confirm", showKey: "confirm" as const },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">{t("title")}</p>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          {FIELDS.map(({ key, labelKey, showKey }) => (
            <div key={key} className="space-y-2">
              <Label>{t(labelKey)}</Label>
              <div className="relative">
                <Input type={show[showKey] ? "text" : "password"} placeholder="••••••••"
                  value={form[key]} onChange={set(key)} required className="pr-10" />
                <button type="button"
                  onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {show[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}

          <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
            <Button type="submit" variant="luxury" disabled={isPending}>
              {isPending ? t("updating") : t("change")}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
