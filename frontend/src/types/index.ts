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

export interface ShippingAddress {
  id: number;
  label: string;
  full_name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  formatted: string;
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

export interface Subscriber {
  id: number;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export interface Newsletter {
  id: number;
  subject: string;
  content: string;
  status: "draft" | "sent";
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  instructions: string;
  logo: string | null;
  is_active: boolean;
  order: number;
}

export interface Payment {
  id: number;
  method: PaymentMethod;
  status: "pending" | "confirmed" | "failed";
  transaction_ref: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  order: number;
  is_active: boolean;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  description: string;
  logo: string | null;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  shipping_price: string;
  free_shipping_threshold: string;
  social_links: SocialLink[];
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  rate: string;
  is_active: boolean;
  is_default: boolean;
}

// Cart item lives only in Zustand (client-side)
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Wishlist {
  id: number;
  products: Product[];
  updated_at: string;
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
