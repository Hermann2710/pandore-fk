"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Package, ClipboardList, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ordersApi, authApi } from "@/lib/api";
import { toast } from "sonner";
import type { Order } from "@/types";

// Status badge variant map — reused from OrderCard
const STATUS_VARIANT: Record<Order["status"], string> = {
  pending: "pending", assigned: "assigned", picked_up: "picked_up",
  in_transit: "in_transit", delivered: "delivered", cancelled: "cancelled",
};

function AssignDialog({ order }: { order: Order }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [deliveryManId, setDeliveryManId] = useState("");
  const [notes, setNotes] = useState("");

  const { data: personnel } = useQuery({
    queryKey: ["delivery-personnel"],
    queryFn: () => authApi.deliveryPersonnel().then((r) => r.data),
    enabled: open,
  });

  const { mutate: assign, isPending } = useMutation({
    mutationFn: () =>
      ordersApi.assignOrder(order.id, { delivery_man_id: parseInt(deliveryManId), notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(`Order #${order.id} assigned successfully`);
      setOpen(false);
    },
    onError: () => toast.error("Assignment failed"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="luxury" className="gap-1.5">
          <Users className="h-3.5 w-3.5" /> Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Order #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Delivery Personnel</Label>
            <Select value={deliveryManId} onValueChange={setDeliveryManId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a delivery man…" />
              </SelectTrigger>
              <SelectContent>
                {personnel?.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.username} {p.phone && `— ${p.phone}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Input
              placeholder="Fragile, leave at door…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button
            variant="luxury"
            className="w-full"
            onClick={() => assign()}
            disabled={!deliveryManId || isPending}
          >
            {isPending ? "Assigning…" : "Confirm Assignment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: () => ordersApi.adminOrders(statusFilter).then((r) => r.data),
  });

  // Summary counts per status
  const { data: allOrders } = useQuery({
    queryKey: ["admin-orders", ""],
    queryFn: () => ordersApi.adminOrders().then((r) => r.data),
  });

  const counts = {
    pending: allOrders?.filter((o) => o.status === "pending").length ?? 0,
    assigned: allOrders?.filter((o) => o.status === "assigned").length ?? 0,
    delivered: allOrders?.filter((o) => o.status === "delivered").length ?? 0,
  };

  const statCards = [
    { label: "Pending", value: counts.pending, icon: ClipboardList, color: "text-amber-500" },
    { label: "Assigned", value: counts.assigned, icon: Users, color: "text-blue-500" },
    { label: "Delivered", value: counts.delivered, icon: Package, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Admin <span className="text-primary">Dashboard</span></h1>
        <p className="text-muted-foreground mt-1">Manage orders and assign delivery personnel</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl bg-muted p-3 ${stat.color}`}>
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

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {["pending", "assigned", "picked_up", "in_transit", "delivered", "cancelled", ""].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
            className="capitalize"
          >
            {s || "All"}
          </Button>
        ))}
      </div>

      {/* Orders table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {["Order", "Customer", "Items", "Total", "Status", "Assigned To", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {orders?.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.customer.username}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.items.length} item(s)</td>
                    <td className="px-4 py-3 font-semibold text-primary">${order.total_price}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[order.status] as any} className="capitalize">
                        {order.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.assignment?.delivery_man.username ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {(order.status === "pending" || order.status === "assigned") && (
                        <AssignDialog order={order} />
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {orders?.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No orders in this category</p>
          )}
        </div>
      )}
    </div>
  );
}
