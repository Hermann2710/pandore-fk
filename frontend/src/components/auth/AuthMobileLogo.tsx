"use client";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Package } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function AuthMobileLogo() {
  const { data: config } = useSiteConfig();
  const siteName = config?.site_name ?? "PANDORE";
  const logoUrl = config?.logo
    ? config.logo.startsWith("http") ? config.logo : `http://localhost:8000${config.logo}`
    : null;

  return (
    <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 overflow-hidden">
        {logoUrl
          ? <Image src={logoUrl} alt={siteName} width={32} height={32} className="object-contain" />
          : <Package className="h-4 w-4 text-white" />}
      </div>
      <span className="text-xl font-black text-slate-900">
        {siteName.length > 3
          ? <>{siteName.slice(0, -3)}<span className="text-emerald-500">{siteName.slice(-3)}</span></>
          : <span className="text-emerald-500">{siteName}</span>}
      </span>
    </Link>
  );
}
