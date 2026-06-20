"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Package, MapPin, Mail, Phone } from "lucide-react";
import { useSubscribe } from "@/hooks/useNewsletter";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { useCurrencyStore, formatPrice } from "@/store/currency";
import { mediaUrl } from "@/lib/utils";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const [email, setEmail] = useState("");
  const { mutate: subscribe, isPending } = useSubscribe();
  const { data: config } = useSiteConfig();
  const { currency } = useCurrencyStore();

  const logoUrl = mediaUrl(config?.logo);

  const siteName = config?.site_name ?? "PANDORE";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribe(email.trim(), { onSuccess: () => setEmail("") });
  };

  const threshold = config?.free_shipping_threshold
    ? formatPrice(config.free_shipping_threshold, currency)
    : null;

  const activeSocials = config?.social_links?.filter((s) => s.is_active) ?? [];

  const shopLinks = [
    { label: t("shopCatalog"),       href: "/catalog" },
    { label: t("shopNewArrivals"),   href: "/catalog?tags=new-arrival" },
    { label: t("shopBestsellers"),   href: "/catalog?tags=bestseller" },
    { label: t("shopLimitedEdition"), href: "/catalog?tags=limited-edition" },
  ];

  const accountLinks = [
    { label: t("accountOrders"),   href: "/orders" },
    { label: t("accountWishlist"), href: "/wishlist" },
    { label: t("accountCart"),     href: "/cart" },
    { label: t("accountProfile"),  href: "/profile" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30 overflow-hidden shrink-0">
                {logoUrl
                  ? <Image src={logoUrl} alt={siteName} width={36} height={36} className="object-contain" />
                  : <Package className="h-5 w-5 text-white" />}
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                {siteName.length > 3
                  ? <>{siteName.slice(0, -3)}<span className="text-emerald-400">{siteName.slice(-3)}</span></>
                  : <span className="text-emerald-400">{siteName}</span>}
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              {config?.description || t("description")}
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
            <h3 className="text-white font-semibold text-sm mb-4">{t("shop")}</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t("account")}</h3>
            <ul className="space-y-2.5">
              {accountLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-emerald-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t("stayUpdated")}</h3>
            <p className="text-sm mb-3">{t("newsletterDesc")}</p>
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="flex-1 min-w-0 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isPending}
                className="shrink-0 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 transition-colors px-3 py-2 text-sm font-semibold text-white"
              >
                {isPending ? "…" : "OK"}
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-2">
              {t("alreadySubscribed")}{" "}
              <Link href="/profile?tab=newsletter" className="text-emerald-400 hover:underline">
                {t("manageSubscription")}
              </Link>
            </p>

            {/* Social links */}
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {activeSocials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.platform}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-white transition-colors text-xs font-bold"
                  >
                    {s.platform[0]?.toUpperCase()}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} {siteName}. {t("allRightsReserved")}</p>
          {threshold && (
            <p className="text-emerald-400 font-medium">{t("freeShipping", { threshold })}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
