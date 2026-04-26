import Link from "next/link";
import { Package, ShieldCheck, Truck, Star } from "lucide-react";

const perks = [
  { icon: Star,        text: "Curated luxury catalog" },
  { icon: ShieldCheck, text: "Secure HTTP-only JWT auth" },
  { icon: Truck,       text: "Real-time order tracking" },
  { icon: Package,     text: "Premium delivery experience" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── Left panel — brand & perks ─────────────────────────────────────── */}
      <div className="relative hidden lg:flex flex-col justify-between bg-slate-900 p-12 overflow-hidden">
        {/* Decorative emerald glow */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            PAN<span className="text-emerald-400">DORE</span>
          </span>
        </Link>

        {/* Hero text */}
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            The luxury shopping<br />
            experience you<br />
            <span className="text-emerald-400">deserve.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            A premium platform built for those who expect nothing but the best — from catalog to doorstep.
          </p>

          {/* Perks list */}
          <ul className="space-y-3 pt-2">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 shrink-0">
                  <Icon className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer quote */}
        <p className="relative text-xs text-slate-600">
          &copy; {new Date().getFullYear()} PANDORE. All rights reserved.
        </p>
      </div>

      {/* ── Right panel — form ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center bg-white px-6 py-12 sm:px-12">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <Package className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-black text-slate-900">
            PAN<span className="text-emerald-500">DORE</span>
          </span>
        </Link>

        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>

    </div>
  );
}
