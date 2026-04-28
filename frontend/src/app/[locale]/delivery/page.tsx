"use client";
import DeliveryStatCards from "@/components/delivery/DeliveryStatCards";
import ActiveQueueTable from "@/components/delivery/ActiveQueueTable";
import { useDeliveryQueue } from "@/hooks/useOrders";

export default function DeliveryOverviewPage() {
  const { data: orders, isLoading } = useDeliveryQueue();

  return (
    <div className="space-y-8">
      <DeliveryStatCards orders={orders} isLoading={isLoading} />
      <ActiveQueueTable orders={orders} isLoading={isLoading} />
    </div>
  );
}
