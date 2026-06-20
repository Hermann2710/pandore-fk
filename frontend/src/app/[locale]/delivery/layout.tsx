"use client";
import { useState } from "react";
import DeliverySidebar from "@/components/layout/DeliverySidebar";
import DeliveryHeader from "@/components/layout/DeliveryHeader";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-40 md:static md:z-auto transition-transform duration-300 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <DeliverySidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DeliveryHeader onMobileMenuToggle={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
