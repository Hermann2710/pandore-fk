"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, FolderOpen, Tag,
  ClipboardList, Users, Package, ChevronLeft, LayoutTemplate,
  CreditCard, Mail, DollarSign, Settings,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface Props { collapsed: boolean; onToggle: () => void; }

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const { data: config } = useSiteConfig();
  const siteName = config?.site_name ?? "PANDORE";
  const logoUrl = config?.logo
    ? config.logo.startsWith("http") ? config.logo : `http://localhost:8000${config.logo}`
    : null;

  const NAV_ITEMS = [
    { id: "overview",      labelKey: "overview",      icon: LayoutDashboard, href: "/admin" },
    { id: "orders",        labelKey: "orders",        icon: ClipboardList,   href: "/admin/orders" },
    { id: "products",      labelKey: "products",      icon: ShoppingBag,     href: "/admin/products" },
    { id: "categories",    labelKey: "categories",    icon: FolderOpen,      href: "/admin/categories" },
    { id: "tags",          labelKey: "tags",          icon: Tag,             href: "/admin/tags" },
    { id: "users",         labelKey: "users",         icon: Users,           href: "/admin/users" },
    { id: "homepage",      labelKey: "homepage",      icon: LayoutTemplate,  href: "/admin/homepage" },
    { id: "payments",      labelKey: "payments",      icon: CreditCard,      href: "/admin/payments" },
    { id: "newsletter",    labelKey: "newsletter",    icon: Mail,            href: "/admin/newsletter" },
    { id: "currencies",    labelKey: "currencies",    icon: DollarSign,      href: "/admin/currencies" },
    { id: "site-settings", labelKey: "siteSettings",  icon: Settings,        href: "/admin/site-settings" },
  ] as const;

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex flex-col bg-slate-900 text-white shrink-0 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700 shrink-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 overflow-hidden">
          {logoUrl
            ? <Image src={logoUrl} alt={siteName} width={32} height={32} className="object-contain" />
            : <Package className="h-4 w-4 text-white" />}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="font-black text-lg tracking-tight whitespace-nowrap">
              {siteName.length > 3
                ? <>{siteName.slice(0, -3)}<span className="text-emerald-400">{siteName.slice(-3)}</span></>
                : <span className="text-emerald-400">{siteName}</span>}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-3">
            {t("management")}
          </p>
        )}
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.id} href={item.href} title={collapsed ? t(item.labelKey) : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-all group",
                isActive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}>
              <item.icon className="h-4 w-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="whitespace-nowrap">
                    {t(item.labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && <motion.span layoutId="sidebar-dot" className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-4 border-t border-slate-700 pt-3">
        <Link href="/" title={collapsed ? t("backToStore") : undefined}
          className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                {t("backToStore")}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <button onClick={onToggle}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 transition-colors z-10">
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronLeft className="h-3 w-3" />
        </motion.div>
      </button>
    </motion.aside>
  );
}
