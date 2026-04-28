"use client";
import { useState } from "react";
import DeliverySidebar from "@/components/layout/DeliverySidebar";
import DeliveryHeader from "@/components/layout/DeliveryHeader";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <DeliverySidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DeliveryHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
