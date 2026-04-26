import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me().then((r) => r.data),
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setUser(data);
      toast.success(`Welcome back, ${data.username}!`);
      if (data.role === "admin") router.push("/admin");
      else if (data.role === "delivery") router.push("/delivery");
      else router.push("/catalog");
    },
    onError: () => toast.error("Invalid credentials. Please try again."),
  });
}

export function useRegister() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data }) => {
      setUser(data);
      toast.success(`Welcome to PANDORE, ${data.username}!`);
      router.push("/catalog");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.username?.[0] ??
        err?.response?.data?.email?.[0] ??
        err?.response?.data?.password?.[0] ??
        "Registration failed.";
      toast.error(msg);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      qc.clear();
      router.push("/login");
      toast.success("Logged out successfully");
    },
  });
}

export function useDeliveryPersonnel() {
  return useQuery({
    queryKey: ["delivery-personnel"],
    queryFn: () => authApi.deliveryPersonnel().then((r) => r.data),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => authApi.adminUsers().then((r) => r.data),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof authApi.updateUserRole>[1] }) =>
      authApi.updateUserRole(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User updated"); },
    onError: () => toast.error("Update failed"),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.deleteUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User deleted"); },
    onError: () => toast.error("Deletion failed"),
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: ({ data }) => { setUser(data); toast.success("Profile updated"); },
    onError: (err: any) => toast.error(err?.response?.data?.username?.[0] ?? err?.response?.data?.email?.[0] ?? "Update failed"),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? "Incorrect current password"),
  });
}

export function useShippingAddresses() {
  return useQuery({
    queryKey: ["shipping-addresses"],
    queryFn: () => authApi.addresses().then((r) => r.data),
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.createAddress,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["shipping-addresses"] }); toast.success("Address saved"); },
    onError: () => toast.error("Failed to save address"),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof authApi.updateAddress>[1] }) =>
      authApi.updateAddress(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["shipping-addresses"] }); toast.success("Address updated"); },
    onError: () => toast.error("Update failed"),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.deleteAddress,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["shipping-addresses"] }); toast.success("Address deleted"); },
    onError: () => toast.error("Deletion failed"),
  });
}
