import Navbar from "@/components/layout/Navbar";

// All customer-facing shop pages get the full navbar + constrained container
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
