import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const QK = ["shipping-addresses"] as const;

export function useShippingAddresses() {
  return useQuery({
    queryKey: QK,
    queryFn: () => authApi.addresses().then((r) => r.data),
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.createAddress,
    onSuccess: () => { qc.invalidateQueries({ queryKey: QK }); toast.success("Address saved"); },
    onError: () => toast.error("Failed to save address"),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof authApi.updateAddress>[1] }) =>
      authApi.updateAddress(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QK }); toast.success("Address updated"); },
    onError: () => toast.error("Update failed"),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.deleteAddress,
    onSuccess: () => { qc.invalidateQueries({ queryKey: QK }); toast.success("Address deleted"); },
    onError: () => toast.error("Deletion failed"),
  });
}
