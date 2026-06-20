"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, FolderOpen, Tag,
  ClipboardList, Users, Package, ChevronLeft, LayoutTemplate,
  CreditCard, Mail, DollarSign, Settings, Store, LogOut,
} from "lucide-react";
import Image from "next/image";
import { cn, mediaUrl } from "@/lib/utils";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";

interface Props { collapsed: boolean; onToggle: () => void; }

const NAV_GROUPS = [
  {
    labelKey: "overview",
    label: "",
    items: [
      { id: "overview",   labelKey: "overview",   icon: LayoutDashboard, href: "/admin" },
      { id: "orders",     labelKey: "orders",     icon: ClipboardList,   href: "/admin/orders" },
    ],
  },
  {
    labelKey: "catalog",
    label: "Catalogue",
    items: [
      { id: "products",   labelKey: "products",   icon: ShoppingBag,    href: "/admin/products" },
      { id: "categories", labelKey: "categories", icon: FolderOpen,     href: "/admin/categories" },
      { id: "tags",       labelKey: "tags",       icon: Tag,            href: "/admin/tags" },
      { id: "homepage",   labelKey: "homepage",   icon: LayoutTemplate, href: "/admin/homepage" },
    ],
  },
  {
    labelKey: "management",
    label: "Gestion",
    items: [
      { id: "users",        labelKey: "users",        icon: Users,      href: "/admin/users" },
      { id: "payments",     labelKey: "payments",     icon: CreditCard, href: "/admin/payments" },
      { id: "newsletter",   labelKey: "newsletter",   icon: Mail,       href: "/admin/newsletter" },
      { id: "currencies",   labelKey: "currencies",   icon: DollarSign, href: "/admin/currencies" },
      { id: "site-settings",labelKey: "siteSettings", icon: Settings,   href: "/admin/site-settings" },
    ],
  },
] as const;

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const { data: config } = useSiteConfig();
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const siteName = config?.site_name ?? "PANDORE";
  const logoUrl = mediaUrl(config?.logo);

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 252 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex h-full flex-col shrink-0 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #07101f 60%, #050d1a 100%)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0">
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-lg"
          style={{ background: "linear-gradient(135deg, #34d399 0%, #059669 100%)", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
        >
          {logoUrl
            ? <Image src={logoUrl} alt={siteName} width={36} height={36} className="object-contain" />
            : <Package className="h-5 w-5 text-white drop-shadow" />}
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
              <p className="text-[10px] text-emerald-500/70 uppercase tracking-[0.18em] font-semibold mt-0.5">
                {t("adminPanelLabel")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top separator */}
      <div className="mx-4 h-px shrink-0" style={{ background: "linear-gradient(90deg, transparent, rgba(148,163,184,0.12), transparent)" }} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-none">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.labelKey} className={gi > 0 ? "mt-6" : ""}>
            <AnimatePresence>
              {!collapsed && group.label && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.14em] px-3 mb-2"
                >
                  {group.labelKey === "catalog" ? t("catalogGroup") : t("managementGroup")}
                </motion.p>
              )}
              {!collapsed && !group.label && gi === 0 && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.14em] px-3 mb-2"
                >
                  {t("menuGroup")}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? t(item.labelKey) : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-500 hover:text-slate-200"
                    )}
                    style={isActive ? { background: "rgba(16,185,129,0.08)" } : undefined}
                  >
                    {/* Left active indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-emerald-400"
                        style={{ boxShadow: "0 0 8px rgba(52,211,153,0.6)" }}
                      />
                    )}

                    {/* Hover background */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: "rgba(255,255,255,0.04)" }} />
                    )}

                    {/* Icon */}
                    <span className={cn(
                      "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                      isActive ? "shadow-sm" : ""
                    )}
                      style={isActive ? { background: "rgba(16,185,129,0.15)" } : undefined}
                    >
                      <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-emerald-400" : "text-slate-600 group-hover:text-slate-300")} />
                    </span>

                    {/* Label */}
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
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-2 space-y-1.5 shrink-0">
        <div className="h-px mb-3" style={{ background: "linear-gradient(90deg, transparent, rgba(148,163,184,0.12), transparent)" }} />

        {/* Back to store */}
        <Link
          href="/"
          title={collapsed ? t("backToStore") : undefined}
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
                {t("backToStore")}
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
            {/* Avatar */}
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white font-bold text-xs"
              style={{ background: "linear-gradient(135deg, #34d399 0%, #059669 100%)", boxShadow: "0 2px 8px rgba(16,185,129,0.25)" }}
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
                  <p className="text-[10px] text-slate-500 capitalize leading-tight mt-0.5">{user.role}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!collapsed && (
              <button
                onClick={() => logout()}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:text-red-400 transition-all duration-200"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                title={t("signOut")}
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
