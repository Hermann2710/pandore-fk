import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const QK = ["wishlist"] as const;

export function useWishlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: QK,
    queryFn: () => authApi.wishlist().then((r) => r.data),
    enabled: !!user, // only fetch when logged in
  });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.toggleWishlist,
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: QK });
      toast.success(data.action === "added" ? "Added to wishlist" : "Removed from wishlist", {
        icon: data.action === "added" ? "❤️" : "🤍",
      });
    },
    onError: () => toast.error("Failed to update wishlist"),
  });
}

// Convenience: check if a product is in the wishlist
export function useIsWishlisted(productId: number) {
  const { data } = useWishlist();
  return data?.products.some((p) => p.id === productId) ?? false;
}
