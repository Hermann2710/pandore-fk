"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore, formatPrice } from "@/store/currency";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { currency } = useCurrencyStore();

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/20 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Discover our luxury collection</p>
        <Button variant="luxury" asChild><Link href="/catalog">Browse Catalog</Link></Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
        Your <span className="text-primary">Cart</span>
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div key={item.product.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.product.image
                        ? <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        : <div className="h-full w-full bg-muted" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.product.price, currency)} each</p>
                    </div>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 hover:bg-muted text-sm">−</button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 hover:bg-muted text-sm">+</button>
                    </div>
                    <p className="font-bold text-primary w-20 text-right">{formatPrice(parseFloat(item.product.price) * item.quantity, currency)}</p>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-bold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate">{item.product.name} ×{item.quantity}</span>
                    <span>{formatPrice(parseFloat(item.product.price) * item.quantity, currency)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice(), currency)}</span>
                </div>
              </div>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button variant="luxury" size="lg" className="w-full gap-2" onClick={() => router.push("/checkout")}>
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
