"use client";
import Link from "next/link";
import { Package, MapPin, Mail, Phone, Globe, Share2, Send } from "lucide-react";

const links = {
  Shop: [
    { label: "Catalog", href: "/catalog" },
    { label: "New Arrivals", href: "/catalog?tags=new-arrival" },
    { label: "Bestsellers", href: "/catalog?tags=bestseller" },
    { label: "Limited Edition", href: "/catalog?tags=limited-edition" },
  ],
  Account: [
    { label: "My Orders", href: "/orders" },
    { label: "My Wishlist", href: "/wishlist" },
    { label: "My Cart", href: "/cart" },
    { label: "Profile", href: "/profile" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                PAN<span className="text-emerald-400">DORE</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Premium e-commerce & delivery platform. Quality products, fast delivery.
            </p>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Yaoundé, Cameroon</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> contact@pandore.cm</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> +237 6XX XXX XXX</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm hover:text-emerald-400 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Stay Updated</h3>
            <p className="text-sm mb-3">Get notified about new arrivals and exclusive deals.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition-colors px-3 py-2 text-sm font-semibold text-white"
              >
                OK
              </button>
            </form>
            <div className="flex items-center gap-3 mt-5">
              {[Globe, Share2, Send].map((Icon, i) => (
                <a key={i} href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} Pandore. All rights reserved.</p>
          <p className="text-emerald-400 font-medium">Free shipping over 50 000 FCFA</p>
        </div>
      </div>
    </footer>
  );
}
