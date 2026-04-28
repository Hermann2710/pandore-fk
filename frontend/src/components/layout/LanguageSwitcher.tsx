"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";

const LOCALES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: string) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 p-0.5">
      {LOCALES.map((l) => (
        <motion.button
          key={l.code}
          whileTap={{ scale: 0.92 }}
          onClick={() => switchLocale(l.code)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
            locale === l.code
              ? "bg-emerald-500 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>{l.flag}</span>
          <span>{l.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
