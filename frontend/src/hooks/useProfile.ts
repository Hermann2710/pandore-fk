import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

// Self-service profile mutations — only for the authenticated user's own data.

export function useUpdateProfile() {
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: ({ data }) => {
      setUser(data);
      toast.success("Profile updated");
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.username?.[0] ??
        err?.response?.data?.email?.[0] ??
        "Update failed"
      ),
  });
}

export function useDeleteAvatar() {
  const { refetch } = useAuth();
  return useMutation({
    mutationFn: authApi.deleteAvatar,
    onSuccess: () => {
      refetch();
      toast.success("Avatar removed");
    },
    onError: () => toast.error("Failed to remove avatar"),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (err: any) =>
      toast.error(err?.response?.data?.detail ?? "Incorrect current password"),
  });
}
