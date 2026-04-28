"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthTabs from "@/components/auth/AuthTabs";
import { useRegister } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    if (form.password.length < 8) {
      toast.error(t("passwordTooShort"));
      return;
    }
    register({
      username: form.username,
      email: form.email,
      password: form.password,
      phone: form.phone,
    });
  };

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div>
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          {t("registerTitle")}
        </h1>
        <p className="text-sm text-slate-500">{t("registerSubtitle")}</p>
      </div>

      <AuthTabs />

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">{t("username")}</Label>
          <Input
            id="username"
            placeholder={t("registerUsernamePlaceholder")}
            value={form.username}
            onChange={set("username")}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={form.email}
            onChange={set("email")}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">{t("phoneOptional")}</Label>
          <Input
            id="phone"
            placeholder={t("phonePlaceholder")}
            value={form.phone}
            onChange={set("phone")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("minChars")}
              value={form.password}
              onChange={set("password")}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm">{t("confirmPassword")}</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            required
          />
        </div>

        <motion.div whileTap={{ scale: 0.98 }} className="pt-1">
          <Button
            type="submit"
            variant="luxury"
            size="lg"
            className="w-full gap-2"
            disabled={isPending}
          >
            <UserPlus className="h-4 w-4" />
            {isPending ? t("creatingAccount") : t("register")}
          </Button>
        </motion.div>

        <p className="text-xs text-center text-slate-400 pt-1">
          {t("customerAccountNote")}
        </p>
      </motion.form>
    </div>
  );
}
