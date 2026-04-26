"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Map route segments to human-readable breadcrumb labels
const LABELS: Record<string, string> = {
  admin: "Admin",
  orders: "Orders",
  products: "Products",
  categories: "Categories",
  tags: "Tags",
  users: "Users",
  homepage: "Homepage",
  overview: "Overview",
};

function Breadcrumbs() {
  const pathname = usePathname();
  // e.g. /admin/products → ["admin", "products"]
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm">
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = LABELS[seg] ?? seg;
        return (
          <span key={href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
            {isLast ? (
              <span className="font-semibold text-slate-900">{label}</span>
            ) : (
              <Link href={href} className="text-slate-500 hover:text-slate-700 transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default function AdminHeader() {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shrink-0">
      <Breadcrumbs />

      <div className="flex items-center gap-3">
        {/* Quick search hint */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-1.5 text-sm text-slate-400">
          <Search className="h-3.5 w-3.5" />
          <span>Quick search…</span>
          <kbd className="ml-2 rounded border bg-white px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
        </div>

        {/* Notifications placeholder */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>

        {/* User info + logout */}
        <div className="flex items-center gap-2 border-l pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-tight">{user?.username}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
