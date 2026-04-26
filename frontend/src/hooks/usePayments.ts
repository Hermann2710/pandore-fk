import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api";
import { toast } from "sonner";

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentsApi.methods().then((r) => r.data),
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.confirm,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: () => toast.error("Payment confirmation failed"),
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useAdminPaymentMethods() {
  return useQuery({
    queryKey: ["admin-payment-methods"],
    queryFn: () => paymentsApi.adminMethods().then((r) => r.data),
  });
}

export function useAdminPayments() {
  return useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => paymentsApi.adminPayments().then((r) => r.data),
  });
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.createMethod,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-payment-methods"] }); toast.success("Payment method created"); },
    onError: () => toast.error("Failed to create payment method"),
  });
}

export function useUpdatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => paymentsApi.updateMethod(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-payment-methods"] }); toast.success("Payment method updated"); },
    onError: () => toast.error("Failed to update payment method"),
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.deleteMethod,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-payment-methods"] }); toast.success("Payment method deleted"); },
    onError: () => toast.error("Failed to delete payment method"),
  });
}
