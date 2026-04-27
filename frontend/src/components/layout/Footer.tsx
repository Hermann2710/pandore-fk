"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, MapPin, Mail, Phone } from "lucide-react";
import { useSubscribe } from "@/hooks/useNewsletter";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useCurrencyStore, formatPrice } from "@/store/currency";

const shopLinks = [
  { label: "Catalog", href: "/catalog" },
  { label: "New Arrivals", href: "/catalog?tags=new-arrival" },
  { label: "Bestsellers", href: "/catalog?tags=bestseller" },
  { label: "Limited Edition", href: "/catalog?tags=limited-edition" },
];

const accountLinks = [
  { label: "My Orders", href: "/orders" },
  { label: "My Wishlist", href: "/wishlist" },
  { label: "My Cart", href: "/cart" },
  { label: "Profile", href: "/profile" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const { mutate: subscribe, isPending } = useSubscribe();
  const { data: config } = useSiteConfig();
  const { currency } = useCurrencyStore();

  const logoUrl = config?.logo
    ? config.logo.startsWith("http") ? config.logo : `http://localhost:8000${config.logo}`
    : null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe(email.trim(), { onSuccess: () => setEmail("") });
  };

  const threshold = config?.free_shipping_threshold
    ? formatPrice(config.free_shipping_threshold, currency)
    : null;

  const activeSocials = config?.social_links?.filter((s) => s.is_active) ?? [];

  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30 overflow-hidden shrink-0">
                {logoUrl
                  ? <Image src={logoUrl} alt={config?.site_name ?? "Logo"} width={36} height={36} className="object-contain" />
                  : <Package className="h-5 w-5 text-white" />}
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                {config?.site_name
                  ? <>{config.site_name.slice(0, -3)}<span className="text-emerald-400">{config.site_name.slice(-3)}</span></>
                  : <>PAN<span className="text-emerald-400">DORE</span></>}
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              {config?.description || "Premium e-commerce & delivery platform. Quality products, fast delivery."}
            </p>
            <div className="space-y-1.5 text-sm">
              {(config?.address || config?.city) && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  {[config.address, config.city, config.country].filter(Boolean).join(", ")}
                </p>
              )}
              {config?.email && (
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  {config.email}
                </p>
              )}
              {config?.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  {config.phone}
                </p>
              )}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-emerald-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Account</h3>
            <ul className="space-y-2.5">
              {accountLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-emerald-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Stay Updated</h3>
            <p className="text-sm mb-3">Get notified about new arrivals and exclusive deals.</p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="flex-1 min-w-0 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition-colors" />
              <button type="submit" disabled={isPending}
                className="shrink-0 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 transition-colors px-3 py-2 text-sm font-semibold text-white">
                {isPending ? "…" : "OK"}
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-2">
              Already subscribed?{" "}
              <Link href="/profile?tab=newsletter" className="text-emerald-400 hover:underline">Manage subscription →</Link>
            </p>

            {/* Social links */}
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {activeSocials.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    title={s.platform}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-white transition-colors text-xs font-bold">
                    {s.platform[0]?.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} {config?.site_name ?? "Pandore"}. All rights reserved.</p>
          {threshold && (
            <p className="text-emerald-400 font-medium">Free shipping over {threshold}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
