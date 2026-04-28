import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PANDORE — Luxury E-Commerce",
  description: "Premium shopping experience",
};

// Minimal root layout — locale-specific providers live in [locale]/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geist.variable} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
