import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

// Handles login, register, logout — session lifecycle only.
// User state lives in AuthContext, not localStorage.

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setUser(data);
      // Set the role cookie client-side so the middleware can read it
      // (needed when backend is cross-origin and can't set cookies directly)
      document.cookie = `pandore_role=${data.role};path=/;max-age=${60 * 60 * 24 * 7};samesite=lax`;
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
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data }) => {
      setUser(data);
      document.cookie = `pandore_role=${data.role};path=/;max-age=${60 * 60 * 24 * 7};samesite=lax`;
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
  const { setUser } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      document.cookie = "pandore_role=;path=/;max-age=0";
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
