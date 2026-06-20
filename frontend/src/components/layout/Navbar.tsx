"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
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
  Heart,
  Shield,
  Tag,
  FolderOpen,
  X,
} from "lucide-react";
import Image from "next/image";
import { useLogout } from "@/hooks/useAuth";
import { useHydrated } from "@/hooks/useHydrated";
import { useCartStore } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/context/AuthContext";
import { catalogApi } from "@/lib/api";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { mediaUrl } from "@/lib/utils";
import type { Category } from "@/types";

function TopBar() {
  const t = useTranslations("nav");
  const { user } = useAuth();
  const { data: currencies = [] } = useCurrencies();
  const { currency, setCurrency } = useCurrencyStore();
  const { data: config } = useSiteConfig();

  const location =
    [config?.city, config?.country].filter(Boolean).join(", ") || "Cameroon";
  const threshold = config?.free_shipping_threshold
    ? formatPrice(config.free_shipping_threshold, currency)
    : null;

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 hidden md:block">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-emerald-400" />
            <span>
              {t("deliverTo")}{" "}
              <span className="text-white font-medium">{location}</span>
            </span>
          </div>
          {currencies.length > 0 && (
            <select
              value={currency.code}
              onChange={(e) => {
                const found = currencies.find((c) => c.code === e.target.value);
                if (found) setCurrency(found);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded px-2 py-0.5 outline-none cursor-pointer hover:border-emerald-500 transition-colors"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.symbol}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-5">
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Shield className="h-3 w-3 text-emerald-400" /> {t("adminPanel")}
            </Link>
          )}
          {user?.role === "delivery" && (
            <Link
              href="/delivery"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Truck className="h-3 w-3 text-emerald-400" /> {t("myDeliveries")}
            </Link>
          )}
          <Link href="/catalog" className="hover:text-white transition-colors">
            {t("newArrivals")}
          </Link>
          <Link
            href="/catalog?ordering=price"
            className="hover:text-white transition-colors"
          >
            {t("bestSellers")}
          </Link>
          {threshold && (
            <span className="text-emerald-400 font-medium">
              {t("freeShipping", { threshold })}
            </span>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  const t = useTranslations("catalog");
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
          placeholder={t("searchPlaceholder")}
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

function AccountMenu() {
  const t = useTranslations("nav");
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col items-start text-white hover:text-emerald-300 transition-colors group"
      >
        <span className="text-xs text-slate-300 group-hover:text-emerald-300">
          {user ? t("hello", { name: user.username }) : t("helloGuest")}
        </span>
        <span className="text-sm font-bold flex items-center gap-0.5">
          {t("account")} <ChevronDown className="h-3.5 w-3.5 mt-0.5" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-60 rounded-xl border bg-white shadow-xl z-50 overflow-hidden"
          >
            {!user ? (
              <div className="p-4 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                >
                  {t("signIn")}
                </Link>
                <p className="text-xs text-center text-slate-500">
                  {t("newCustomer")}{" "}
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    {t("startHere")}
                  </Link>
                </p>
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2.5 border-b flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {user.username}
                    </p>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="py-1">
                  <MenuItem
                    href="/profile"
                    icon={User}
                    label={t("myProfile")}
                    onClick={() => setOpen(false)}
                  />
                  <MenuItem
                    href="/orders"
                    icon={User}
                    label={t("myOrders")}
                    onClick={() => setOpen(false)}
                  />
                </div>
                <div className="border-t py-1">
                  {user.role === "customer" && (
                    <>
                      <MenuItem
                        href="/wishlist"
                        icon={Heart}
                        label={t("myWishlist")}
                        onClick={() => setOpen(false)}
                      />
                      <MenuItem
                        href="/cart"
                        icon={ShoppingCart}
                        label={t("myCart")}
                        onClick={() => setOpen(false)}
                      />
                    </>
                  )}
                  {user.role === "admin" && (
                    <MenuItem
                      href="/admin"
                      icon={LayoutDashboard}
                      label={t("adminDashboard")}
                      onClick={() => setOpen(false)}
                    />
                  )}
                  {user.role === "delivery" && (
                    <MenuItem
                      href="/delivery"
                      icon={Truck}
                      label={t("myQueue")}
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
                    <LogOut className="h-4 w-4" /> {t("signOut")}
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

function WishlistIcon() {
  const hydrated = useHydrated();
  const { user } = useAuth();
  const { data: wishlist } = useWishlist();
  const wishlistCount = wishlist?.products.length ?? 0;
  if (!user) return null;
  return (
    <Link
      href="/wishlist"
      className="relative text-white hover:text-rose-300 transition-colors"
    >
      <Heart className="h-6 w-6" />
      <AnimatePresence>
        {hydrated && wishlistCount > 0 && (
          <motion.span
            key={wishlistCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white"
          >
            {wishlistCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

function CartIcon() {
  const hydrated = useHydrated();
  const cartCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  return (
    <Link
      href="/cart"
      className="relative text-white hover:text-emerald-300 transition-colors"
    >
      <ShoppingCart className="h-6 w-6" />
      <AnimatePresence>
        {hydrated && cartCount > 0 && (
          <motion.span
            key={cartCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-bold text-slate-900"
          >
            {cartCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

function ActionIcons() {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <WishlistIcon />
      <CartIcon />
    </div>
  );
}

const VISIBLE_CATS = 4;

function CatDropdown({
  cat,
  t,
  tc,
}: {
  cat: Category;
  t: ReturnType<typeof useTranslations>;
  tc: ReturnType<typeof useTranslations>;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const onLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative h-full"
    >
      <Link
        href={`/catalog?category=${cat.slug}`}
        className={`flex items-center gap-1.5 px-3 h-full text-sm text-slate-200 hover:text-white hover:bg-slate-700 transition-colors rounded-sm whitespace-nowrap ${
          open ? "bg-slate-700 text-white" : ""
        }`}
      >
        <FolderOpen className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        {cat.name}
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="absolute left-0 top-full w-64 bg-white rounded-b-xl shadow-2xl border border-t-0 z-50 overflow-hidden"
          >
            <div className="bg-emerald-500 px-4 py-3">
              <p className="text-white font-bold text-sm">{cat.name}</p>
              {cat.description && (
                <p className="text-emerald-100 text-xs mt-0.5">
                  {cat.description}
                </p>
              )}
            </div>
            <div className="p-3 space-y-1">
              {[
                {
                  href: `/catalog?category=${cat.slug}`,
                  label: t("allCategory", { name: cat.name }),
                },
                {
                  href: `/catalog?category=${cat.slug}&ordering=-created_at`,
                  label: tc("newest"),
                },
                {
                  href: `/catalog?category=${cat.slug}&ordering=price`,
                  label: tc("priceAsc"),
                },
                {
                  href: `/catalog?category=${cat.slug}&ordering=-price`,
                  label: tc("priceDesc"),
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MoreCatsDropdown({
  cats,
  t,
  tc,
}: {
  cats: Category[];
  t: ReturnType<typeof useTranslations>;
  tc: ReturnType<typeof useTranslations>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative h-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-3 h-full text-sm text-slate-200 hover:text-white hover:bg-slate-700 transition-colors rounded-sm whitespace-nowrap ${
          open ? "bg-slate-700 text-white" : ""
        }`}
      >
        <Menu className="h-3.5 w-3.5 text-emerald-400" />
        {t("more")}{" "}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full w-56 bg-white rounded-b-xl shadow-2xl border border-t-0 z-50 overflow-hidden py-2"
          >
            {cats.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <FolderOpen className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                {cat.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryStrip() {
  const t = useTranslations("nav");
  const tc = useTranslations("catalog");
  const tcommon = useTranslations("common");
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.categories().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const visible = categories.slice(0, VISIBLE_CATS);
  const overflow = categories.slice(VISIBLE_CATS);

  return (
    <div className="bg-slate-800 border-t border-slate-700">
      <div className="mx-auto max-w-7xl px-4">
        {/* Desktop */}
        <div className="hidden md:flex items-center h-10 gap-1">
          <Link
            href="/catalog"
            className="flex items-center gap-2 px-3 h-full text-sm font-semibold text-white hover:bg-slate-700 transition-colors rounded-sm shrink-0"
          >
            <Menu className="h-4 w-4" /> {t("all")}
          </Link>
          <div className="w-px h-5 bg-slate-600 mx-1 shrink-0" />

          {visible.map((cat) => (
            <CatDropdown key={cat.id} cat={cat} t={t} tc={tc} />
          ))}

          {overflow.length > 0 && (
            <MoreCatsDropdown cats={overflow} t={t} tc={tc} />
          )}

          <div className="ml-auto flex items-center gap-1 shrink-0">
            <Link
              href="/catalog?tags=new-arrival"
              className="px-3 h-full flex items-center text-xs text-emerald-400 font-semibold hover:text-emerald-300 transition-colors whitespace-nowrap"
            >
              {t("newArrivals")}
            </Link>
            <Link
              href="/catalog?tags=bestseller"
              className="px-3 h-full flex items-center text-xs text-amber-400 font-semibold hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              {t("bestSellers")}
            </Link>
            <Link
              href="/catalog?tags=limited-edition"
              className="px-3 h-full flex items-center text-xs text-rose-400 font-semibold hover:text-rose-300 transition-colors whitespace-nowrap"
            >
              {tcommon("limitedEdition")}
            </Link>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center justify-between w-full py-2.5 text-sm text-white font-medium"
          >
            <span className="flex items-center gap-2">
              <Menu className="h-4 w-4" /> {t("browseCategories")}
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
                  {categories.map((cat) => (
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

export default function Navbar() {
  const { data: config } = useSiteConfig();
  const t = useTranslations("nav");
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const siteName = config?.site_name ?? "PANDORE";
  const tagline = config?.tagline || t("luxuryStore");
  const logoUrl = mediaUrl(config?.logo);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const hydrated = useHydrated();

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full"
    >
      <TopBar />
      <div className="bg-slate-900 py-3">
        <div className="mx-auto max-w-7xl px-4 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30 overflow-hidden"
            >
              {logoUrl ? (
                <Image src={logoUrl} alt={siteName} width={36} height={36} className="object-contain" />
              ) : (
                <Package className="h-5 w-5 text-white" />
              )}
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tight text-white">
                {siteName.length > 3 ? (
                  <>{siteName.slice(0, -3)}<span className="text-emerald-400">{siteName.slice(-3)}</span></>
                ) : (
                  <span className="text-emerald-400">{siteName}</span>
                )}
              </span>
              <p className="text-[9px] text-slate-400 -mt-1 tracking-widest uppercase">{tagline}</p>
            </div>
          </Link>

          {/* Search — hidden on mobile */}
          <div className="hidden md:flex flex-1">
            <SearchBar />
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <AccountMenu />
            <ActionIcons />
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <Link href="/cart" className="relative text-white">
              <ShoppingCart className="h-6 w-6" />
              {hydrated && cartCount > 0 && (
                <span className="absolute -top-2 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-bold text-slate-900">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="text-white p-1"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pt-2">
          <SearchBar />
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-slate-700 mt-2"
            >
              <div className="px-4 py-4 space-y-1">
                {!user ? (
                  <div className="space-y-2 pb-3 border-b border-slate-700">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center bg-emerald-500 text-white font-semibold py-2 rounded-lg text-sm">
                      {t("signIn")}
                    </Link>
                  </div>
                ) : (
                  <div className="pb-3 border-b border-slate-700">
                    <p className="text-white font-semibold text-sm">{user.username}</p>
                    <p className="text-slate-400 text-xs capitalize">{user.role}</p>
                  </div>
                )}
                {[
                  { href: "/catalog", label: t("newArrivals") },
                  { href: "/cart", label: t("myCart") },
                  ...(user ? [
                    { href: "/orders", label: t("myOrders") },
                    { href: "/profile", label: t("myProfile") },
                    { href: "/wishlist", label: t("myWishlist") },
                  ] : []),
                  ...(user?.role === "admin" ? [{ href: "/admin", label: t("adminDashboard") }] : []),
                  ...(user?.role === "delivery" ? [{ href: "/delivery", label: t("myQueue") }] : []),
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-2 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-2 py-2.5 text-sm text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                    {t("signOut")}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CategoryStrip />
    </motion.div>
  );
}
