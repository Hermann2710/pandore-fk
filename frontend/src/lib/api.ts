import api from "./axios";
import type { Product, Category, Tag, Order, User, HomepageSection, ShippingAddress, Wishlist, PaymentMethod, Payment, Subscriber, Newsletter } from "@/types";

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<User>("/auth/login/", data),
  // Registration is open to customers only — role defaults to 'customer' on backend
  register: (data: { username: string; email: string; password: string; phone?: string }) =>
    api.post<User>("/auth/register/", data),
  logout: () => api.post("/auth/logout/"),
  me: () => api.get<User>("/auth/me/"),
  deliveryPersonnel: () => api.get<User[]>("/users/delivery-personnel/"),
  // Admin — user management
  adminUsers: () => api.get<User[]>("/users/admin/users/"),
  updateUserRole: (userId: number, data: { role?: string; phone?: string; is_active?: boolean }) =>
    api.patch<User>(`/users/admin/users/${userId}/`, data),
  deleteUser: (userId: number) =>
    api.delete(`/users/admin/users/${userId}/delete/`),
  // Self-service profile
  updateProfile: (data: FormData) =>
    api.patch<User>("/users/profile/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post("/users/password/", data),
  // Shipping addresses
  addresses: () => api.get<ShippingAddress[]>("/addresses/"),
  createAddress: (data: Partial<ShippingAddress>) => api.post<ShippingAddress>("/addresses/", data),
  updateAddress: (id: number, data: Partial<ShippingAddress>) => api.patch<ShippingAddress>(`/addresses/${id}/`, data),
  deleteAddress: (id: number) => api.delete(`/addresses/${id}/`),
  // Wishlist
  wishlist: () => api.get<Wishlist>("/wishlist/"),
  toggleWishlist: (product_id: number) => api.post<Wishlist & { action: "added" | "removed" }>("/wishlist/", { product_id }),
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
    payment_method_id: number;
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

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentsApi = {
  methods: () => api.get<PaymentMethod[]>("/payments/methods/"),
  confirm: (orderId: number) => api.post<Payment>(`/payments/${orderId}/confirm/`),
  // Admin
  adminMethods: () => api.get<PaymentMethod[]>("/payments/admin/methods/"),
  createMethod: (data: FormData) =>
    api.post<PaymentMethod>("/payments/admin/methods/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateMethod: (id: number, data: FormData) =>
    api.patch<PaymentMethod>(`/payments/admin/methods/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteMethod: (id: number) => api.delete(`/payments/admin/methods/${id}/`),
  adminPayments: () => api.get<Payment[]>("/payments/admin/payments/"),
};

// ── Newsletter ────────────────────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) => api.post("/newsletter/subscribe/", { email }),
  unsubscribe: (email: string) => api.post("/newsletter/unsubscribe/", { email }),
  check: (email: string) => api.get<{ subscribed: boolean }>("/newsletter/check/", { params: { email } }),
  // Admin
  adminSubscribers: () => api.get<Subscriber[]>("/newsletter/admin/subscribers/"),
  adminNewsletters: () => api.get<Newsletter[]>("/newsletter/admin/newsletters/"),
  createNewsletter: (data: { subject: string; content: string }) =>
    api.post<Newsletter>("/newsletter/admin/newsletters/", data),
  updateNewsletter: (id: number, data: { subject: string; content: string }) =>
    api.patch<Newsletter>(`/newsletter/admin/newsletters/${id}/`, data),
  deleteNewsletter: (id: number) => api.delete(`/newsletter/admin/newsletters/${id}/`),
  sendNewsletter: (id: number) =>
    api.post<{ detail: string; sent_to: number }>(`/newsletter/admin/newsletters/${id}/send/`),
};
