"use client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import OrderCard from "@/components/OrderCard";
import { ordersApi } from "@/lib/api";
import Link from "next/link";

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => ordersApi.myOrders().then((r) => r.data),
  });

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">My <span className="text-primary">Orders</span></h1>
        <p className="text-muted-foreground mt-1">Track all your purchases in real time</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : orders?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-24 text-center"
        >
          <Package className="h-14 w-14 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-medium">No orders yet</p>
          <Button variant="luxury" className="mt-4" asChild>
            <Link href="/catalog">Start Shopping</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders?.map((order, i) => <OrderCard key={order.id} order={order} index={i} />)}
        </div>
      )}
    </div>
  );
}
