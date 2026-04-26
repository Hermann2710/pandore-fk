"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Package, LogOut, LayoutDashboard, Truck } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems);

  const { mutate: logout } = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      router.push("/login");
      toast.success("Logged out successfully");
    },
  });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
          >
            <Package className="h-4 w-4 text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">
            PAN<span className="text-primary">DORE</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">
            Catalog
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Link>
          )}
          {user?.role === "delivery" && (
            <Link href="/delivery" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Truck className="h-4 w-4" /> My Queue
            </Link>
          )}
          {user?.role === "customer" && (
            <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
              My Orders
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user?.role === "customer" && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                  >
                    {totalItems()}
                  </motion.span>
                )}
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-muted-foreground">
                {user.username}
              </span>
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="luxury" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
