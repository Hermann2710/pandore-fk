import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { currenciesApi } from "@/lib/api";
import { toast } from "sonner";

export function useCurrencies() {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: () => currenciesApi.list().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminCurrencies() {
  return useQuery({
    queryKey: ["admin-currencies"],
    queryFn: () => currenciesApi.adminList().then((r) => r.data),
  });
}

export function useCreateCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: currenciesApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-currencies"] }); qc.invalidateQueries({ queryKey: ["currencies"] }); toast.success("Currency created"); },
    onError: () => toast.error("Failed to create currency"),
  });
}

export function useUpdateCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => currenciesApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-currencies"] }); qc.invalidateQueries({ queryKey: ["currencies"] }); toast.success("Currency updated"); },
    onError: () => toast.error("Failed to update currency"),
  });
}

export function useDeleteCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: currenciesApi.remove,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-currencies"] }); qc.invalidateQueries({ queryKey: ["currencies"] }); toast.success("Currency deleted"); },
    onError: () => toast.error("Failed to delete currency"),
  });
}
