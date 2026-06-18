"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Truck, CheckCircle, LayoutDashboard, ChevronLeft, Package, Store, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";

interface Props { collapsed: boolean; onToggle: () => void; }

const NAV_ITEMS = [
  { labelKey: "overview",         icon: LayoutDashboard, href: "/delivery" },
  { labelKey: "activeDeliveries", icon: Truck,           href: "/delivery/active" },
  { labelKey: "completed",        icon: CheckCircle,     href: "/delivery/completed" },
] as const;

export default function DeliverySidebar({ collapsed, onToggle }: Props) {
  const t = useTranslations("delivery");
  const ta = useTranslations("admin");
  const pathname = usePathname();
  const { data: config } = useSiteConfig();
  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  const siteName = config?.site_name ?? "PANDORE";
  const logoUrl = config?.logo
    ? config.logo.startsWith("http") ? config.logo : `http://localhost:8000${config.logo}`
    : null;

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 252 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col shrink-0 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #07101f 60%, #050d1a 100%)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0">
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-lg"
          style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}
        >
          {logoUrl
            ? <Image src={logoUrl} alt={siteName} width={36} height={36} className="object-contain" />
            : <Truck className="h-5 w-5 text-white drop-shadow" />}
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              <p className="font-black text-[15px] tracking-tight whitespace-nowrap leading-none text-white">
                {siteName}
              </p>
              <p className="text-[10px] text-blue-400/70 uppercase tracking-[0.18em] font-semibold mt-0.5">
                {t("sidebarSubtitle")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px shrink-0" style={{ background: "linear-gradient(90deg, transparent, rgba(148,163,184,0.12), transparent)" }} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-none">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.14em] px-3 mb-2"
            >
              {t("myPortal")}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? t(item.labelKey) : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                  isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-200"
                )}
                style={isActive ? { background: "rgba(59,130,246,0.1)" } : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="delivery-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-blue-400"
                    style={{ boxShadow: "0 0 8px rgba(96,165,250,0.6)" }}
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(255,255,255,0.04)" }} />
                )}
                <span
                  className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200"
                  style={isActive ? { background: "rgba(59,130,246,0.15)" } : undefined}
                >
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-blue-400" : "text-slate-600 group-hover:text-slate-300")} />
                </span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap flex-1 relative"
                    >
                      {t(item.labelKey)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-2 space-y-1.5 shrink-0">
        <div className="h-px mb-3" style={{ background: "linear-gradient(90deg, transparent, rgba(148,163,184,0.12), transparent)" }} />

        {/* Back to store */}
        <Link
          href="/"
          title={collapsed ? ta("backToStore") : undefined}
          className="group flex items-center gap-3 rounded-xl px-3 py-2 text-slate-600 hover:text-slate-300 transition-all duration-200 relative"
        >
          <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(255,255,255,0.04)" }} />
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
            <Store className="h-4 w-4" />
          </span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="relative whitespace-nowrap text-xs font-medium"
              >
                {ta("backToStore")}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* User card */}
        {user && (
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-200",
              collapsed ? "justify-center" : ""
            )}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white font-bold text-xs"
              style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)", boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
            >
              {user.username[0].toUpperCase()}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="min-w-0 flex-1"
                >
                  <p className="text-xs font-semibold text-slate-200 truncate leading-tight">{user.username}</p>
                  <p className="text-[10px] text-blue-400/70 capitalize leading-tight mt-0.5">Livreur</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button
                onClick={() => logout()}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:text-red-400 transition-all duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                title="Déconnexion"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-18 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:text-white transition-all duration-200 z-10"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(148,163,184,0.15)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronLeft className="h-3 w-3" />
        </motion.div>
      </button>
    </motion.aside>
  );
}
