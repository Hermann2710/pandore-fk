"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Package, ShieldCheck, Truck, Star } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function AuthBrandPanel() {
  const t = useTranslations("auth");
  const tf = useTranslations("footer");
  const { data: config } = useSiteConfig();

  const siteName = config?.site_name ?? "PANDORE";
  const logoUrl = config?.logo
    ? config.logo.startsWith("http") ? config.logo : `http://localhost:8000${config.logo}`
    : null;

  const perks = [
    { icon: Star,        text: t("perk1") },
    { icon: ShieldCheck, text: t("perk2") },
    { icon: Truck,       text: t("perk3") },
    { icon: Package,     text: t("perk4") },
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between bg-slate-900 p-12 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="relative flex items-center gap-3 w-fit">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30 overflow-hidden">
          {logoUrl
            ? <Image src={logoUrl} alt={siteName} width={40} height={40} className="object-contain" />
            : <Package className="h-5 w-5 text-white" />}
        </div>
        <span className="text-2xl font-black tracking-tight text-white">
          {siteName.length > 3
            ? <>{siteName.slice(0, -3)}<span className="text-emerald-400">{siteName.slice(-3)}</span></>
            : <span className="text-emerald-400">{siteName}</span>}
        </span>
      </Link>

      {/* Hero text */}
      <div className="relative space-y-6">
        <h1 className="text-4xl font-bold text-white leading-tight">
          {t("heroLine1")}<br />{t("heroLine2")}<br />
          <span className="text-emerald-400">{t("heroLine3")}</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">{t("heroDesc")}</p>
        <ul className="space-y-3 pt-2">
          {perks.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-slate-300">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 shrink-0">
                <Icon className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-sm">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <p className="relative text-xs text-slate-600">
        &copy; {new Date().getFullYear()} {siteName}. {tf("allRightsReserved")}
      </p>
    </div>
  );
}
