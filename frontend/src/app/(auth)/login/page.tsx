"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Package, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const { mutate: login, isPending } = useMutation({
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

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
    >
      <form
        onSubmit={(e) => { e.preventDefault(); login(form); }}
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
          <Button type="submit" variant="luxury" size="lg" className="w-full gap-2" disabled={isPending}>
            <LogIn className="h-4 w-4" />
            {isPending ? "Signing in…" : "Sign In"}
          </Button>
        </motion.div>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button onClick={onSwitch} className="text-primary font-medium hover:underline">
          Create one
        </button>
      </div>

      {/* Demo hint */}
      <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Demo accounts:</p>
        <p>Admin: <code>admin / admin123</code></p>
        <p>Delivery: <code>delivery1 / delivery123</code></p>
        <p>Customer: <code>customer1 / customer123</code></p>
      </div>
    </motion.div>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const { mutate: register, isPending } = useMutation({
    mutationFn: () =>
      authApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
        phone: form.phone,
      }),
    onSuccess: ({ data }) => {
      setUser(data);
      toast.success(`Welcome to PANDORE, ${data.username}!`);
      // New registrations are always customers
      router.push("/catalog");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.username?.[0]
        ?? err?.response?.data?.email?.[0]
        ?? err?.response?.data?.password?.[0]
        ?? "Registration failed. Please try again.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    register();
  };

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="reg-username">Username</Label>
            <Input
              id="reg-username"
              placeholder="john_doe"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="reg-phone">Phone (optional)</Label>
            <Input
              id="reg-phone"
              placeholder="+1 555 0100"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label>Account type</Label>
            <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
              Customer (default)
            </div>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
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

          <div className="space-y-2 col-span-2">
            <Label htmlFor="reg-confirm">Confirm Password</Label>
            <Input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              required
            />
          </div>
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button type="submit" variant="luxury" size="lg" className="w-full gap-2" disabled={isPending}>
            <UserPlus className="h-4 w-4" />
            {isPending ? "Creating account…" : "Create Account"}
          </Button>
        </motion.div>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-primary font-medium hover:underline">
          Sign in
        </button>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="flex min-h-[85vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-border/50 overflow-hidden">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30"
            >
              <Package className="h-7 w-7 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Join PANDORE"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Sign in to your luxury account"
                : "Create your account — it only takes a minute"}
            </CardDescription>

            {/* Login / Register toggle tabs */}
            <div className="mt-4 flex rounded-lg bg-muted p-1 gap-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-white shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <AnimatePresence mode="wait">
              {mode === "login"
                ? <LoginForm key="login" onSwitch={() => setMode("register")} />
                : <RegisterForm key="register" onSwitch={() => setMode("login")} />
              }
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
