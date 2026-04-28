"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthTabs from "@/components/auth/AuthTabs";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const { mutate: login, isPending } = useLogin();

  return (
    <div>
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">{t("loginTitle")}</h1>
        <p className="text-sm text-slate-500">{t("loginSubtitle")}</p>
      </div>

      <AuthTabs />

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={(e) => {
          e.preventDefault();
          login(form);
        }}
        className="space-y-5"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">{t("username")}</Label>
          <Input
            id="username"
            placeholder={t("usernamePlaceholder")}
            value={form.username}
            onChange={(e) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
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

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            variant="luxury"
            size="lg"
            className="w-full gap-2"
            disabled={isPending}
          >
            <LogIn className="h-4 w-4" />
            {isPending ? t("signingIn") : t("login")}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
