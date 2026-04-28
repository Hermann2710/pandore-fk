"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AuthTabs() {
  const t = useTranslations("auth");
  const pathname = usePathname();

  const TABS = [
    { label: t("login"),    href: "/login" },
    { label: t("register"), href: "/register" },
  ] as const;

  return (
    <div className="flex rounded-xl bg-slate-100 p-1 gap-1 mb-8">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname.endsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href}
            className={cn("relative flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors",
              isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700")}>
            {isActive && (
              <motion.div layoutId="auth-tab-bg" className="absolute inset-0 rounded-lg bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 35 }} />
            )}
            <span className="relative">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
