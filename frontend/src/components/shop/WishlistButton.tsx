"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  productId: number;
  className?: string;
  size?: "sm" | "md";
}

export default function WishlistButton({ productId, className, size = "md" }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const isWishlisted = useIsWishlisted(productId);
  const { mutate: toggle, isPending } = useToggleWishlist();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Wait for auth to resolve before deciding — avoids redirect during initial load
    if (isLoading) return;
    if (!user) { router.push("/login"); return; }
    toggle(productId);
  };

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const btnSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      disabled={isPending}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors",
        isWishlisted
          ? "bg-rose-100 text-rose-500 hover:bg-rose-200"
          : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200",
        btnSize,
        className
      )}
    >
      <Heart className={cn(iconSize, isWishlisted && "fill-rose-500")} />
    </motion.button>
  );
}
