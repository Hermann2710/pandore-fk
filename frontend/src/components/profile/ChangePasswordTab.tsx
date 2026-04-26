"use client";
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
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const { mutate: change, isPending } = useChangePassword();

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.confirm) { toast.error("New passwords do not match."); return; }
    if (form.new_password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    change(
      { current_password: form.current_password, new_password: form.new_password },
      { onSuccess: () => setForm({ current_password: "", new_password: "", confirm: "" }) }
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Change Password</p>
            <p className="text-sm text-muted-foreground">Use a strong password of at least 8 characters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          {(["current_password", "new_password", "confirm"] as const).map((field) => {
            const labels = { current_password: "Current Password", new_password: "New Password", confirm: "Confirm New Password" };
            const showKey = field === "current_password" ? "current" : field === "new_password" ? "next" : "confirm";
            return (
              <div key={field} className="space-y-2">
                <Label>{labels[field]}</Label>
                <div className="relative">
                  <Input
                    type={show[showKey as keyof typeof show] ? "text" : "password"}
                    placeholder="••••••••"
                    value={form[field]}
                    onChange={set(field)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey as keyof typeof show] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {show[showKey as keyof typeof show] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}

          <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
            <Button type="submit" variant="luxury" disabled={isPending}>
              {isPending ? "Updating…" : "Update Password"}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
