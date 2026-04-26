"use client";
import { use, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Tag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart";
import { useProduct } from "@/hooks/useCatalog";
import { toast } from "sonner";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { data: product, isLoading } = useProduct(slug);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-1/4" /><Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) return <p className="text-center py-20 text-muted-foreground">Product not found.</p>;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`, { description: `Qty: ${quantity}` });
  };

  return (
    <div className="space-y-8">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          {product.image
            ? <Image src={product.image} alt={product.name} fill className="object-cover" />
            : <div className="flex h-full items-center justify-center"><Package className="h-20 w-20 text-muted-foreground/20" /></div>
          }
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
          {product.category && <p className="text-sm text-muted-foreground uppercase tracking-widest">{product.category.name}</p>}
          <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
          <p className="text-4xl font-bold text-primary">${parseFloat(product.price).toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => <Badge key={tag.id} variant="emerald"><Tag className="h-3 w-3 mr-1" />{tag.name}</Badge>)}
            </div>
          )}

          {product.attributes.length > 0 && (
            <div className="rounded-lg border p-4 space-y-2">
              {product.attributes.map((attr) => (
                <div key={attr.key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{attr.key}</span>
                  <span className="font-medium">{attr.value}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-sm">
            {product.stock > 0
              ? <span className="text-emerald-600 font-medium">{product.stock} in stock</span>
              : <span className="text-destructive font-medium">Out of stock</span>
            }
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-muted transition-colors text-lg font-medium">−</button>
              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-muted transition-colors text-lg font-medium">+</button>
            </div>
            <motion.div whileTap={{ scale: 0.96 }} className="flex-1">
              <Button variant="luxury" size="lg" className="w-full gap-2" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
