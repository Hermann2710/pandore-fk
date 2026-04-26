// Shared TypeScript types — single source of truth for the whole frontend

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "delivery" | "customer";
  phone: string;
  avatar: string | null;
  is_active: boolean;
  date_joined: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  key: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  image: string | null;
  category: Category | null;
  tags: Tag[];
  attributes: ProductAttribute[];
  is_active: boolean;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface DeliveryAssignment {
  id: number;
  delivery_man: User;
  assigned_at: string;
  notes: string;
}

export interface Order {
  id: number;
  customer: User;
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  shipping_address: string;
  total_price: string;
  items: OrderItem[];
  assignment: DeliveryAssignment | null;
  created_at: string;
  updated_at: string;
}

// Cart item lives only in Zustand (client-side)
export interface CartItem {
  product: Product;
  quantity: number;
}

// ── Homepage ──────────────────────────────────────────────────────────────────
export type SectionType = "hero_carousel" | "product_row" | "category_banner" | "promo_banner";

export interface HomepageSection {
  id: number;
  title: string;
  subtitle: string;
  type: SectionType;
  order: number;
  is_active: boolean;
  products: Product[];
  category: Category | null;
  cta_label: string;
  cta_url: string;
  bg_color: string;
  bg_image: string | null;
}
