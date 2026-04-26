"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Sign In",  href: "/login" },
  { label: "Register", href: "/register" },
] as const;

// Tab switcher shared between login and register pages.
// Navigation is URL-driven — no useState needed.
export default function AuthTabs() {
  const pathname = usePathname();

  return (
    <div className="flex rounded-xl bg-slate-100 p-1 gap-1 mb-8">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors",
              isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="auth-tab-bg"
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
