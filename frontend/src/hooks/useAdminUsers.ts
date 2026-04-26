import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const QK = ["admin-users"] as const;

export function useAdminUsers() {
  return useQuery({
    queryKey: QK,
    queryFn: () => authApi.adminUsers().then((r) => r.data),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof authApi.updateUserRole>[1] }) =>
      authApi.updateUserRole(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QK }); toast.success("User updated"); },
    onError: () => toast.error("Update failed"),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.deleteUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: QK }); toast.success("User deleted"); },
    onError: () => toast.error("Deletion failed"),
  });
}
