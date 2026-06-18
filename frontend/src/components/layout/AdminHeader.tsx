"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useAuth";

const BREADCRUMB_KEYS: Record<string, string> = {
  admin:           "admin",
  orders:          "orders",
  products:        "products",
  categories:      "categories",
  tags:            "tags",
  users:           "users",
  homepage:        "homepage",
  currencies:      "currencies",
  newsletter:      "newsletter",
  payments:        "payments",
  "site-settings": "siteSettings",
};

function Breadcrumbs() {
  const t = useTranslations("admin.breadcrumb");
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const key = BREADCRUMB_KEYS[seg];
        const label = key ? t(key as any) : seg;
        return (
          <span key={href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
            {isLast
              ? <span className="font-semibold text-slate-800">{label}</span>
              : <Link href={href} className="text-slate-400 hover:text-slate-600 transition-colors">{label}</Link>
            }
          </span>
        );
      })}
    </nav>
  );
}

export default function AdminHeader() {
  const { mutate: logout } = useLogout();

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-sm px-6 shrink-0">
      <Breadcrumbs />
      <button
        onClick={() => logout()}
        title="Déconnexion"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </header>
  );
}
