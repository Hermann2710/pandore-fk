"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Package, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const { mutate: login, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setUser(data);
      toast.success(`Welcome back, ${data.username}!`);
      // Route based on role — each role has its own world
      if (data.role === "admin") router.push("/admin");
      else if (data.role === "delivery") router.push("/delivery");
      else router.push("/catalog");
    },
    onError: () => toast.error("Invalid credentials. Please try again."),
  });

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30"
            >
              <Package className="h-7 w-7 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Welcome to PANDORE</CardTitle>
            <CardDescription>Sign in to your luxury account</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login(form);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="your_username"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button type="submit" variant="luxury" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? "Signing in…" : "Sign In"}
                </Button>
              </motion.div>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 rounded-lg bg-muted p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Demo accounts:</p>
              <p>Admin: <code>admin / admin123</code></p>
              <p>Delivery: <code>delivery1 / delivery123</code></p>
              <p>Customer: <code>customer1 / customer123</code></p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
