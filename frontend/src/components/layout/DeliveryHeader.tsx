"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Bell, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const LABELS: Record<string, string> = {
  delivery: "Delivery",
  active: "Active Deliveries",
  completed: "Completed",
};

function Breadcrumbs() {
  const pathname = usePathname();
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
            {isLast
              ? <span className="font-semibold text-slate-900">{label}</span>
              : <Link href={href} className="text-slate-500 hover:text-slate-700 transition-colors">{label}</Link>
            }
          </span>
        );
      })}
    </nav>
  );
}

export default function DeliveryHeader() {
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const qc = useQueryClient();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shrink-0">
      <Breadcrumbs />

      <div className="flex items-center gap-3">
        {/* Manual refresh — useful for delivery men checking new assignments */}
        <Button variant="ghost" size="icon" title="Refresh queue" onClick={() => qc.invalidateQueries({ queryKey: ["delivery-queue"] })}>
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>

        <div className="flex items-center gap-2 border-l pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-tight">{user?.username}</p>
            <p className="text-xs text-slate-500">Delivery</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
