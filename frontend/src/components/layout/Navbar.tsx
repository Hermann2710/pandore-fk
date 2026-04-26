"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingCart,
  Package,
  LogOut,
  LayoutDashboard,
  Truck,
  Search,
  ChevronDown,
  User,
  MapPin,
  Menu,
  X,
  Heart,
  Bell,
  Shield,
  Tag,
  FolderOpen,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { authApi, catalogApi } from "@/lib/api";
import { toast } from "sonner";
import type { Category } from "@/types";

// ── Top utility bar (above main navbar) ──────────────────────────────────────
function TopBar() {
  const { user } = useAuthStore();
  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 hidden md:block">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-emerald-400" />
          <span>
            Deliver to <span className="text-white font-medium">Cameroon</span>
          </span>
        </div>
        <div className="flex items-center gap-5">
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Shield className="h-3 w-3 text-emerald-400" /> Admin Panel
            </Link>
          )}
          {user?.role === "delivery" && (
            <Link
              href="/delivery"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Truck className="h-3 w-3 text-emerald-400" /> My Deliveries
            </Link>
          )}
          <Link href="/catalog" className="hover:text-white transition-colors">
            New Arrivals
          </Link>
          <Link
            href="/catalog?ordering=price"
            className="hover:text-white transition-colors"
          >
            Best Sellers
          </Link>
          <span className="text-emerald-400 font-medium">
            Free shipping over $150
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Search bar ────────────────────────────────────────────────────────────────
function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
      <motion.div
        animate={{ scale: focused ? 1.01 : 1 }}
        transition={{ duration: 0.15 }}
        className="flex rounded-lg overflow-hidden border-2 border-transparent focus-within:border-emerald-400 transition-colors shadow-sm"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products, brands, categories…"
          className="flex-1 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 transition-colors px-5 flex items-center justify-center"
        >
          <Search className="h-5 w-5 text-white" />
        </motion.button>
      </motion.div>
    </form>
  );
}

// ── Account dropdown ──────────────────────────────────────────────────────────
function AccountMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col items-start text-white hover:text-emerald-300 transition-colors group"
      >
        <span className="text-xs text-slate-300 group-hover:text-emerald-300">
          {user ? `Hello, ${user.username}` : "Hello, sign in"}
        </span>
        <span className="text-sm font-bold flex items-center gap-0.5">
          Account <ChevronDown className="h-3.5 w-3.5 mt-0.5" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-white shadow-xl z-50 overflow-hidden"
          >
            {!user ? (
              <div className="p-4 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                >
                  Sign In
                </Link>
                <p className="text-xs text-center text-slate-500">
                  New customer?{" "}
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    Start here
                  </Link>
                </p>
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2 border-b">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {user.username}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                    {user.role}
                  </span>
                </div>
                <div className="py-1">
                  {user.role === "customer" && (
                    <>
                      <MenuItem
                        href="/profile"
                        icon={User}
                        label="My Profile"
                        onClick={() => setOpen(false)}
                      />
                      <MenuItem
                        href="/orders"
                        icon={Package}
                        label="My Orders"
                        onClick={() => setOpen(false)}
                      />
                      <MenuItem
                        href="/cart"
                        icon={ShoppingCart}
                        label="My Cart"
                        onClick={() => setOpen(false)}
                      />
                    </>
                  )}
                  {user.role === "admin" && (
                    <MenuItem
                      href="/admin"
                      icon={LayoutDashboard}
                      label="Admin Dashboard"
                      onClick={() => setOpen(false)}
                    />
                  )}
                  {user.role === "delivery" && (
                    <MenuItem
                      href="/delivery"
                      icon={Truck}
                      label="My Queue"
                      onClick={() => setOpen(false)}
                    />
                  )}
                </div>
                <div className="border-t py-1">
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <Icon className="h-4 w-4 text-slate-400" />
      {label}
    </Link>
  );
}

// ── Cart icon ─────────────────────────────────────────────────────────────────
function CartIcon() {
  const totalItems = useCartStore((s) => s.totalItems);
  const { user } = useAuthStore();
  if (user?.role !== "customer") return null;

  return (
    <Link
      href="/cart"
      className="flex items-end gap-1 text-white hover:text-emerald-300 transition-colors group"
    >
      <div className="relative">
        <ShoppingCart className="h-7 w-7" />
        <AnimatePresence>
          {totalItems() > 0 && (
            <motion.span
              key={totalItems()}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-slate-900"
            >
              {totalItems()}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm font-bold pb-0.5">Cart</span>
    </Link>
  );
}

// ── Category megamenu strip ───────────────────────────────────────────────────
function CategoryStrip() {
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.categories().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const handleMouseEnter = (cat: Category) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredCat(cat);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredCat(null), 150);
  };

  return (
    <div className="bg-slate-800 border-t border-slate-700">
      <div className="mx-auto max-w-7xl px-4">
        {/* Desktop strip */}
        <div className="hidden md:flex items-center gap-1 h-10">
          {/* All categories hamburger */}
          <Link
            href="/catalog"
            className="flex items-center gap-2 px-3 h-full text-sm font-semibold text-white hover:bg-slate-700 transition-colors rounded-sm"
          >
            <Menu className="h-4 w-4" /> All
          </Link>

          <div className="w-px h-5 bg-slate-600 mx-1" />

          {/* Category pills */}
          {categories?.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => handleMouseEnter(cat)}
              onMouseLeave={handleMouseLeave}
              className="relative h-full"
            >
              <Link
                href={`/catalog?category=${cat.slug}`}
                className={`flex items-center gap-1.5 px-3 h-full text-sm text-slate-200 hover:text-white hover:bg-slate-700 transition-colors rounded-sm whitespace-nowrap ${
                  hoveredCat?.id === cat.id ? "bg-slate-700 text-white" : ""
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5 text-emerald-400" />
                {cat.name}
              </Link>

              {/* Mega dropdown */}
              <AnimatePresence>
                {hoveredCat?.id === cat.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    onMouseEnter={() => handleMouseEnter(cat)}
                    onMouseLeave={handleMouseLeave}
                    className="absolute left-0 top-full mt-0 w-64 bg-white rounded-b-xl shadow-2xl border border-t-0 z-50 overflow-hidden"
                  >
                    {/* Dropdown header */}
                    <div className="bg-emerald-500 px-4 py-3">
                      <p className="text-white font-bold text-sm">{cat.name}</p>
                      {cat.description && (
                        <p className="text-emerald-100 text-xs mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <div className="p-3 space-y-1">
                      <Link
                        href={`/catalog?category=${cat.slug}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
                      >
                        <Tag className="h-3.5 w-3.5 text-emerald-500" />
                        All {cat.name}
                      </Link>
                      <Link
                        href={`/catalog?category=${cat.slug}&ordering=-created_at`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Package className="h-3.5 w-3.5 text-slate-400" />
                        New Arrivals
                      </Link>
                      <Link
                        href={`/catalog?category=${cat.slug}&ordering=price`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Tag className="h-3.5 w-3.5 text-slate-400" />
                        Price: Low to High
                      </Link>
                      <Link
                        href={`/catalog?category=${cat.slug}&ordering=-price`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Tag className="h-3.5 w-3.5 text-slate-400" />
                        Price: High to Low
                      </Link>
                    </div>
                    <div className="border-t px-4 py-2.5 bg-slate-50">
                      <Link
                        href={`/catalog?category=${cat.slug}`}
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        See all in {cat.name} →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Right side quick links */}
          <div className="ml-auto flex items-center gap-1">
            <Link
              href="/catalog?tags=new-arrival"
              className="px-3 h-full flex items-center text-xs text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              href="/catalog?tags=bestseller"
              className="px-3 h-full flex items-center text-xs text-amber-400 font-semibold hover:text-amber-300 transition-colors"
            >
              Bestsellers
            </Link>
            <Link
              href="/catalog?tags=limited-edition"
              className="px-3 h-full flex items-center text-xs text-rose-400 font-semibold hover:text-rose-300 transition-colors"
            >
              Limited Edition
            </Link>
          </div>
        </div>

        {/* Mobile: collapsible category list */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center justify-between w-full py-2.5 text-sm text-white font-medium"
          >
            <span className="flex items-center gap-2">
              <Menu className="h-4 w-4" /> Browse Categories
            </span>
            <motion.div animate={{ rotate: mobileOpen ? 180 : 0 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-slate-700"
              >
                <div className="py-2 grid grid-cols-2 gap-1">
                  {categories?.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog?category=${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      <FolderOpen className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full"
    >
      {/* Tier 1 — utility bar */}
      <TopBar />

      {/* Tier 2 — logo + search + account + cart */}
      <div className="bg-slate-900 py-3">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-4 sm:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30"
            >
              <Package className="h-5 w-5 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tight text-white">
                PAN<span className="text-emerald-400">DORE</span>
              </span>
              <p className="text-[9px] text-slate-400 -mt-1 tracking-widest uppercase">
                Luxury Store
              </p>
            </div>
          </Link>

          {/* Search */}
          <SearchBar />

          {/* Right actions */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <AccountMenu />
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Tier 3 — category strip */}
      <CategoryStrip />
    </motion.div>
  );
}
