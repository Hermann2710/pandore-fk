import api from "./axios";
import type { Product, Category, Tag, Order, User, HomepageSection, ShippingAddress, Wishlist } from "@/types";

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<User>("/auth/login/", data),
  // Registration is open to customers only — role defaults to 'customer' on backend
  register: (data: { username: string; email: string; password: string; phone?: string }) =>
    api.post<User>("/auth/register/", data),
  logout: () => api.post("/auth/logout/"),
  me: () => api.get<User>("/auth/me/"),
  deliveryPersonnel: () => api.get<User[]>("/auth/delivery-personnel/"),
  // Admin — user management
  adminUsers: () => api.get<User[]>("/auth/admin/users/"),
  updateUserRole: (userId: number, data: { role?: string; phone?: string; is_active?: boolean }) =>
    api.patch<User>(`/auth/admin/users/${userId}/`, data),
  deleteUser: (userId: number) =>
    api.delete(`/auth/admin/users/${userId}/delete/`),
  // Self-service profile
  updateProfile: (data: FormData) =>
    api.patch<User>("/auth/profile/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post("/auth/password/", data),
  // Shipping addresses
  addresses: () => api.get<ShippingAddress[]>("/auth/addresses/"),
  createAddress: (data: Partial<ShippingAddress>) => api.post<ShippingAddress>("/auth/addresses/", data),
  updateAddress: (id: number, data: Partial<ShippingAddress>) => api.patch<ShippingAddress>(`/auth/addresses/${id}/`, data),
  deleteAddress: (id: number) => api.delete(`/auth/addresses/${id}/`),
  // Wishlist
  wishlist: () => api.get<Wishlist>("/auth/wishlist/"),
  toggleWishlist: (product_id: number) => api.post<Wishlist & { action: "added" | "removed" }>("/auth/wishlist/", { product_id }),
};

// ── Public Catalog ────────────────────────────────────────────────────────────
export const catalogApi = {
  products: (params?: Record<string, string>) =>
    api.get<Product[]>("/catalog/products/", { params }),
  product: (slug: string) =>
    api.get<Product>(`/catalog/products/${slug}/`),
  categories: () => api.get<Category[]>("/catalog/categories/"),
  tags: () => api.get<Tag[]>("/catalog/tags/"),
  homepageSections: () =>
    api.get<HomepageSection[]>("/catalog/homepage/"),
};

// ── Admin — Catalog CRUD ──────────────────────────────────────────────────────
export const adminCatalogApi = {
  // Products
  products: (params?: Record<string, string>) =>
    api.get<Product[]>("/catalog/admin/products/", { params }),
  createProduct: (data: FormData) =>
    api.post<Product>("/catalog/admin/products/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateProduct: (id: number, data: FormData) =>
    api.patch<Product>(`/catalog/admin/products/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProduct: (id: number) =>
    api.delete(`/catalog/admin/products/${id}/`),

  // Categories
  categories: () => api.get<Category[]>("/catalog/admin/categories/"),
  createCategory: (data: Partial<Category>) =>
    api.post<Category>("/catalog/admin/categories/", data),
  updateCategory: (id: number, data: Partial<Category>) =>
    api.patch<Category>(`/catalog/admin/categories/${id}/`, data),
  deleteCategory: (id: number) =>
    api.delete(`/catalog/admin/categories/${id}/`),

  // Tags
  tags: () => api.get<Tag[]>("/catalog/admin/tags/"),
  createTag: (data: Partial<Tag>) =>
    api.post<Tag>("/catalog/admin/tags/", data),
  updateTag: (id: number, data: Partial<Tag>) =>
    api.patch<Tag>(`/catalog/admin/tags/${id}/`, data),
  deleteTag: (id: number) =>
    api.delete(`/catalog/admin/tags/${id}/`),

  // Homepage sections
  homepageSections: () =>
    api.get<HomepageSection[]>("/catalog/admin/homepage/"),
  createHomepageSection: (data: FormData) =>
    api.post<HomepageSection>("/catalog/admin/homepage/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateHomepageSection: (id: number, data: FormData) =>
    api.patch<HomepageSection>(`/catalog/admin/homepage/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteHomepageSection: (id: number) =>
    api.delete(`/catalog/admin/homepage/${id}/`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const ordersApi = {
  myOrders: () => api.get<Order[]>("/orders/my-orders/"),
  checkout: (data: {
    shipping_address: string;
    items: { product_id: number; quantity: number }[];
  }) => api.post<Order>("/orders/checkout/", data),
  // Admin
  adminOrders: (status?: string) =>
    api.get<Order[]>("/orders/admin/", { params: status ? { status } : {} }),
  assignOrder: (
    orderId: number,
    data: { delivery_man_id: number; notes?: string }
  ) => api.post<Order>(`/orders/admin/${orderId}/assign/`, data),
  // Delivery
  deliveryQueue: () => api.get<Order[]>("/orders/delivery/queue/"),
  updateStatus: (orderId: number) =>
    api.patch<Order>(`/orders/delivery/${orderId}/status/`),
};
