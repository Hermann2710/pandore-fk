import api from "./axios";
import type { Product, Category, Tag, Order, User } from "@/types";

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<User>("/auth/login/", data),
  register: (data: { username: string; email: string; password: string; role: string }) =>
    api.post<User>("/auth/register/", data),
  logout: () => api.post("/auth/logout/"),
  me: () => api.get<User>("/auth/me/"),
  deliveryPersonnel: () => api.get<User[]>("/auth/delivery-personnel/"),
};

// ── Public Catalog ────────────────────────────────────────────────────────────
export const catalogApi = {
  products: (params?: Record<string, string>) =>
    api.get<Product[]>("/catalog/products/", { params }),
  product: (slug: string) =>
    api.get<Product>(`/catalog/products/${slug}/`),
  categories: () => api.get<Category[]>("/catalog/categories/"),
  tags: () => api.get<Tag[]>("/catalog/tags/"),
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
