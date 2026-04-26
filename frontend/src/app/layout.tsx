import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PANDORE — Luxury E-Commerce",
  description: "Premium shopping experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased min-h-screen`}>
        <QueryProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">{children}</main>
          {/* Sonner toast — positioned top-right with luxury styling */}
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                toast: "bg-card border border-border text-foreground shadow-lg",
                success: "border-emerald-200",
                error: "border-red-200",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
