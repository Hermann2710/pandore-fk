import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/layout/QueryProvider";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PANDORE — Luxury E-Commerce",
  description: "Premium shopping experience",
};

// Root layout is intentionally bare — each route group owns its own
// shell (Navbar, sidebar, container). This avoids the navbar bleeding
// into the admin and delivery dashboards.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased min-h-screen`}>
        <QueryProvider>
          {children}
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
