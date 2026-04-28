"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Truck, CheckCircle, LayoutDashboard, ChevronLeft, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface Props { collapsed: boolean; onToggle: () => void; }

export default function DeliverySidebar({ collapsed, onToggle }: Props) {
  const t = useTranslations("delivery");
  const ta = useTranslations("admin");
  const pathname = usePathname();
  const { data: config } = useSiteConfig();

  const siteName = config?.site_name ?? "PANDORE";
  const logoUrl = config?.logo
    ? config.logo.startsWith("http") ? config.logo : `http://localhost:8000${config.logo}`
    : null;

  const NAV_ITEMS = [
    { labelKey: "overview",          icon: LayoutDashboard, href: "/delivery" },
    { labelKey: "activeDeliveries",  icon: Truck,           href: "/delivery/active" },
    { labelKey: "completed",         icon: CheckCircle,     href: "/delivery/completed" },
  ] as const;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col bg-slate-900 text-white shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700 shrink-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 overflow-hidden">
          {logoUrl
            ? <Image src={logoUrl} alt={siteName} width={32} height={32} className="object-contain" />
            : <Truck className="h-4 w-4 text-white" />}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <p className="font-black text-base tracking-tight whitespace-nowrap">
                {siteName.length > 3
                  ? <>{siteName.slice(0, -3)}<span className="text-emerald-400">{siteName.slice(-3)}</span></>
                  : <span className="text-emerald-400">{siteName}</span>}
              </p>
              <p className="text-[10px] text-slate-400 -mt-0.5 tracking-widest uppercase">
                {t("sidebarSubtitle")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-3">
            {t("myPortal")}
          </p>
        )}
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? t(item.labelKey) : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="whitespace-nowrap">
                    {t(item.labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.span layoutId="delivery-dot" className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to store */}
      <div className="px-2 pb-4 border-t border-slate-700 pt-3">
        <Link
          href="/"
          title={collapsed ? ta("backToStore") : undefined}
          className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                {ta("backToStore")}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors z-10"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronLeft className="h-3 w-3" />
        </motion.div>
      </button>
    </motion.aside>
  );
}
