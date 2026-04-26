"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, FolderOpen, Tag, ClipboardList,
  TrendingUp, Users, Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ordersApi } from "@/lib/api";
import { adminCatalogApi } from "@/lib/api";
import OrdersTab from "./components/OrdersTab";
import ProductsTab from "./components/ProductsTab";
import CategoriesTab from "./components/CategoriesTab";
import TagsTab from "./components/TagsTab";

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",   label: "Overview",   icon: LayoutDashboard },
  { id: "orders",     label: "Orders",     icon: ClipboardList },
  { id: "products",   label: "Products",   icon: ShoppingBag },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "tags",       label: "Tags",       icon: Tag },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Overview stat cards ───────────────────────────────────────────────────────
function OverviewTab() {
  const { data: allOrders } = useQuery({
    queryKey: ["admin-orders", ""],
    queryFn: () => ordersApi.adminOrders().then((r) => r.data),
  });
  const { data: products } = useQuery({
    queryKey: ["admin-products", ""],
    queryFn: () => adminCatalogApi.products().then((r) => r.data),
  });
  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminCatalogApi.categories().then((r) => r.data),
  });
  const { data: tags } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => adminCatalogApi.tags().then((r) => r.data),
  });

  const revenue = allOrders
    ?.filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + parseFloat(o.total_price), 0) ?? 0;

  const stats = [
    { label: "Total Revenue",   value: `$${revenue.toFixed(2)}`, icon: TrendingUp,    color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Total Orders",    value: allOrders?.length ?? 0,   icon: ClipboardList, color: "text-blue-500",    bg: "bg-blue-50" },
    { label: "Pending Orders",  value: allOrders?.filter((o) => o.status === "pending").length ?? 0, icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Products",        value: products?.length ?? 0,    icon: ShoppingBag,   color: "text-purple-500",  bg: "bg-purple-50" },
    { label: "Categories",      value: categories?.length ?? 0,  icon: FolderOpen,    color: "text-rose-500",    bg: "bg-rose-50" },
    { label: "Tags",            value: tags?.length ?? 0,        icon: Tag,           color: "text-cyan-500",    bg: "bg-cyan-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn("rounded-xl p-3", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent orders preview */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>{["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {allOrders?.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.customer.username}</td>
                  <td className="px-4 py-3 font-semibold text-primary">${order.total_price}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{order.status.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(allOrders?.length ?? 0) === 0 && (
            <p className="text-center py-10 text-muted-foreground">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const tabContent: Record<TabId, React.ReactNode> = {
    overview:   <OverviewTab />,
    orders:     <OrdersTab />,
    products:   <ProductsTab />,
    categories: <CategoriesTab />,
    tags:       <TagsTab />,
  };

  return (
    <div className="flex gap-8 min-h-[80vh]">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-56 shrink-0"
      >
        <div className="sticky top-24 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Admin Panel
          </p>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm shadow-primary/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
              {/* Active indicator dot */}
              {activeTab === tab.id && (
                <motion.span layoutId="tab-dot" className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      </motion.aside>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div className="border-b pb-4">
            <h1 className="text-2xl font-bold capitalize">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {activeTab === "overview"   && "Platform-wide metrics at a glance"}
              {activeTab === "orders"     && "Manage and assign all customer orders"}
              {activeTab === "products"   && "Full product catalog management"}
              {activeTab === "categories" && "Organize products into categories"}
              {activeTab === "tags"       && "Label products with searchable tags"}
            </p>
          </div>

          {tabContent[activeTab]}
        </motion.div>
      </div>
    </div>
  );
}
