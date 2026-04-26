import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

export function useMyOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: () => ordersApi.myOrders().then((r) => r.data),
  });
}

export function useCheckout() {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  return useMutation({
    mutationFn: ordersApi.checkout,
    onSuccess: (res) => {
      clearCart();
      router.push(`/checkout/${res.data.id}/confirm`);
    },
    onError: () => toast.error("Checkout failed. Please try again."),
  });
}

export function useAdminOrders(status?: string) {
  return useQuery({
    queryKey: ["admin-orders", status ?? ""],
    queryFn: () => ordersApi.adminOrders(status || undefined).then((r) => r.data),
  });
}

export function useAssignOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: Parameters<typeof ordersApi.assignOrder>[1] }) =>
      ordersApi.assignOrder(orderId, data),
    onSuccess: (_, { orderId }) => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(`Order #${orderId} assigned`);
    },
    onError: () => toast.error("Assignment failed"),
  });
}

export function useDeliveryQueue() {
  return useQuery({
    queryKey: ["delivery-queue"],
    queryFn: () => ordersApi.deliveryQueue().then((r) => r.data),
    refetchInterval: 30_000,
  });
}

export function useUpdateDeliveryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.updateStatus,
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ["delivery-queue"] });
      toast.success(`Order #${data.id} → ${data.status.replace("_", " ")}`);
    },
    onError: () => toast.error("Status update failed"),
  });
}
